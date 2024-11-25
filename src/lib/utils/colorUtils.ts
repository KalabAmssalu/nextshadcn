// colorUtils.ts
export const getRandomColor = () => {
	const colors = [
		"bg-red-500",
		"bg-blue-500",
		"bg-green-500",
		"bg-yellow-500",
		"bg-purple-500",
	];
	return colors[Math.floor(Math.random() * colors.length)];
};

export const getStatusColor = (status: string) => {
	switch (status.toLowerCase()) {
		case "completed":
			return "green-500";
		case "in progress":
			return "yellow-500";
		case "pending":
			return "blue-500";
		case "cancelled":
			return "red-500";
		default:
			return "gray-500";
	}
};
