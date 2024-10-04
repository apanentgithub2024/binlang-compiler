document.getElementById("compile").addEventListener(() => {
	const program = BINLang(document.getElementById("program").value)
	const blob = new Blob([program], "application/octet-stream")
	const bu = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = bu
	a.download = "result.binl"
	a.click()
	a.remove()
	URL.revokeObjectURL(bu)
})
