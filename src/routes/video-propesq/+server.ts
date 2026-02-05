export function GET() {
	return new Response(null, {
		status: 301,
		headers: {
			Location:
				"https://drive.google.com/file/d/1R2AK1sErEDE-DFtKvI5UoF1tzIEEQeJ4/view?usp=drive_link"
		}
	})
}
