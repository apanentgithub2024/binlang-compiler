function BINLangInterpreter(compiledCode) {
	let bytecode = new Uint8Array(compiledCode)
	const memory = new Map()
	let i = 0
	function decodeIdentifier() {
		let identifier = ""
		while (bytecode[i] !== 255) {
			identifier += String.fromCharCode(bytecode[i] + 65)
			i++
		}
		i++
		return identifier
	}
	while (i < bytecode.length) {
		let command = bytecode[i]
		i++
		switch (command) {
			case 1:
				{
					let identifier = decodeIdentifier()
					if (memory.has(identifier)) {
						throw new Error(`Variable '${identifier}' was already defined`)
					}
					memory.set(identifier, 0)
				}
				break
			case 2:
				{
					let identifier = decodeIdentifier()
					if (!memory.has(identifier)) {
						throw new Error(`Variable '${identifier}' is not defined`)
					}
					let value = bytecode[i]
					i++
					memory.set(identifier, value)
				}
				break
			case 3:
				{
					let identifier = decodeIdentifier()
					if (!memory.has(identifier)) {
						throw new Error(`Variable '${identifier}' is not defined`)
					}
					memory.delete(identifier)
				}
				break
			default:
				throw new Error(`Unknown command '${command}' at position ${i - 1}`)
		}
	}
	console.log("Final state of memory:", memory)
	return memory
}
