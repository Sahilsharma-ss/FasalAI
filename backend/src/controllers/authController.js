import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, avatar: user.avatar || null };
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ token, user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user._id);
  res.json({ token, user: publicUser(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user: publicUser(user) });
}

export async function githubAuth(req, res) {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "GitHub authorization code is required" });
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return res.status(401).json({
      message: tokenData.error_description || "GitHub authentication failed",
    });
  }

  const accessToken = tokenData.access_token;

  // Fetch user profile from GitHub
  const [profileRes, emailsRes] = await Promise.all([
    fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "FasalAI" },
    }),
    fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "FasalAI" },
    }),
  ]);

  const profile = await profileRes.json();
  const emails = await emailsRes.json();

  if (!profile.id) {
    return res.status(401).json({ message: "Failed to fetch GitHub profile" });
  }

  // Get the primary verified email
  const primaryEmail =
    (Array.isArray(emails) && emails.find((e) => e.primary && e.verified)?.email) ||
    (Array.isArray(emails) && emails.find((e) => e.verified)?.email) ||
    profile.email;

  if (!primaryEmail) {
    return res.status(400).json({
      message: "No verified email found on your GitHub account. Please add and verify an email on GitHub.",
    });
  }

  const githubId = String(profile.id);
  const name = profile.name || profile.login;
  const avatar = profile.avatar_url || null;

  // Find existing user by githubId OR email, or create a new one
  let user = await User.findOne({ githubId });

  if (!user) {
    // Check if a user with this email already exists (registered via email/password)
    user = await User.findOne({ email: primaryEmail });

    if (user) {
      // Link the existing account to GitHub
      user.githubId = githubId;
      if (avatar) user.avatar = avatar;
      await user.save();
    } else {
      // Create a brand new user
      user = await User.create({
        name,
        email: primaryEmail,
        githubId,
        avatar,
      });
    }
  } else {
    // Update avatar on each login
    if (avatar && user.avatar !== avatar) {
      user.avatar = avatar;
      await user.save();
    }
  }

  const token = signToken(user._id);
  res.json({ token, user: publicUser(user) });
}

