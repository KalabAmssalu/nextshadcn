// utils/nameUtils.js
export const getInitials = (fullName: string) => {
	const names = fullName.split(" ");
	const initials = names.map((name) => name.charAt(0)).join("");
	return initials.toUpperCase(); // Return uppercase initials
};
