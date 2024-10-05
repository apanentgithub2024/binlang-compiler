// NAME: Unnamedbruh
// PLATFORM: GitHub
// PROFILE: https://github.com/apanentgithub2024
// LICENSE: MIT License
var BINLang = (function(code) {
	function compileIdentifier(id) {
		return new Uint8Array(id.split("").map(i => i.charCodeAt(0) - 65))
	}
	const reg = /(DEF|SET)\s+[a-zA-Z]*|[0-9]+/gm
	const array = [0], tokens = [...code.matchAll(reg)]
	let id = 0, c
	for (const token of tokens) {
		switch (id) {
			case 0:
				c = token.slice(0, 3)
				if (c === "DEF") {
					array.push(1)
					id = 1
				} else if (c === "SET") {
					array.push(2)
					id = 2
				}
				break
			case 1:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'DEF', got empty string")
				}
				array.push(0)
				const tok = compileIdentifier(token)
				array.push(...tok)
				array.push(255)
				array.push(0)
				id = 0
				break
			case 2:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'DEF', got empty string")
				}
				array.push(1)
				const tok2 = compileIdentifier(token)
				array.push(...tok2)
				array.push(255)
				array.push(1)
				id = 3
				break
			case 3:
				c = Number(token)
				array.push(c)
				id = 0
				break
		}
	}
	c = i = "collect this garbage"
	const arrbuffer = new ArrayBuffer(array.length)
	const uint = new Uint8Array(arrbuffer)
	
	return arrbuffer
})
