// NAME: Unnamedbruh
// PLATFORM: GitHub
// PROFILE: https://github.com/Unnamedbruh
// LICENSE: MIT License
var BINLang = (function(code, o, compressed = true) {
	const summedId = [], idPointer = []
	function compileIdentifier(id, unique = false) {
		const data = new Uint8Array(id.split("").map(i => i.charCodeAt(0) - 65)), arr = []
		if (compressed) {
			// The data has the uncompressed data, the 'arr' has the compressed data ('z' points to code 57)
			for (let i = 0; i < data.length; i++) {
				if (i % 4 === 0) {
					arr.push(data[i])
				} else {
					arr[arr.length - 1] += data[i]
				}
			}
			const e = data.reduce((a, b) => a + b, 0)
			arr.push(idPointer.find(i => i[0] === arr)[1] || summedId.reduce((a, b) => b === e ? a + 1 : a, 0))
			if (unique) {
				summedId.push(e)
				idPointer.push([arr, idPointer.length])
			}
			return new Uint8Array(arr)
		} else {
			return data
		}
	}
	const reg = /[0-9]+|[a-zA-Z]+/gm
	const array = [0], tokens = [...code.matchAll(reg).map(i => i.join(""))]
	let id = 0, c
	for (const token of tokens) {
		switch (id) {
			case 0:
				if (token === "DEF") {
					array.push(1)
					id = 1
				} else if (token === "SET") {
					array.push(2)
					id = 2
				} else if (token === "REM") {
					array.push(3)
					id = 4
				}
				break
			case 1:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'DEF', got empty string")
				}
				array.push(0)
				const tok = compileIdentifier(token, true)
				array.push(...tok, 255)
				id = 0
				break
			case 2:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'SET', got empty string")
				}
				array.push(0)
				const tok2 = compileIdentifier(token)
				array.push(...tok2, 255)
				id = 3
				break
			case 3:
				if (token.length === 0) {
					throw new SyntaxError("The 'SET' command must have an integer-based value")
				}
				c = Number(token)
				if (c > 255) {
					throw new TypeError("Integer values cannot exceed beyond 255 - for more info, 8 bits are used per integer type")
				}
				array.push(c)
				id = 0
				break
			case 4:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'REM', got empty string")
				}
				array.push(0)
				const tok3 = compileIdentifier(token)
				array.push(...tok3, 255)
				id = 0
				break
		}
	}
	c = "collect this garbage"
	const arrbuffer = new ArrayBuffer(array.length)
	const uint = new Uint8Array(arrbuffer)
	uint.set(array)
	return o === "arraybuffer" || !o ? arrbuffer : uint
})
