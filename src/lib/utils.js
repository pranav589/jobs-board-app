import { clsx } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { ADMIN, CANDIDATE, EMPLOYER } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function relativeDate(from) {
  return formatDistanceToNowStrict(from, { addSuffix: true });
}

export function generateSlug(str) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, " ");
}

export const isAdmin = (user) => {
  return user?.role === ADMIN;
};

export const isEmployer = (user) => {
  return user?.role === EMPLOYER;
};

export const isCandidate = (user) => {
  return user?.role === CANDIDATE;
};

export const saltAndHashPassword = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export function excludePasswordFromList(user) {
  const result = user.map(({ password, ...rest }) => ({ ...rest }));
  return result;
}

export function excludePassword({ password, ...rest }) {
  return rest;
}
