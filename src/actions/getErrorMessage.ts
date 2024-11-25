const DEFAULT_MESSAGE: string =
	"ያልተጠበቀ ስህተት ተፈጥሯል። እባክዎ ቆየት ብለው ይሞክሩ። ችግሩ ከቀጠለ፣ እባክዎ ድጋፍን ያግኙ።";

export default function getErrorMessage(error: any): string {
	// Try to extract specific error details
	const error_code = error?.response?.data?.error_code;
	const error_message = error?.response?.data?.message;
	const error_extra = error?.response?.data?.extra;
	const error_status = error?.response?.status;

	// Log the error details for debugging
	console.log("Error Code:", error_code);
	console.log("Error Message:", error_message);
	console.log("Error Extra Info:", error_extra);
	console.log("Error Status:", error_status);

	// Return error message based on available details
	if (error_message) {
		return error_message; // Return the error message from the response
	}

	if (error_code) {
		return `Error Code: ${error_code}. Please try again.`; // Return error code if no message
	}

	if (error_status) {
		return `HTTP Status ${error_status}: Something went wrong.`; // Return status if available
	}

	// Fallback to default message if no specific details are available
	return DEFAULT_MESSAGE;
}
