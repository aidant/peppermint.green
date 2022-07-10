export class CSVDecoder {
  #isInQuote = false
  #currentCharacter = ''
  #previousCharacter = ''
  #currentValue = ''
  #currentRecord: string[] = []

  #action(action: 'iterate' | 'commit-character' | 'uncommit-character' | 'commit-value'): null
  #action(action: 'commit-record'): string[]
  #action(
    action: 'iterate' | 'commit-character' | 'uncommit-character' | 'commit-value' | 'commit-record'
  ): null | string[]
  #action(
    action:
      | 'iterate'
      | 'commit-character'
      | 'uncommit-character'
      | 'commit-value'
      | 'commit-record'
      | 'reset'
  ): null | string[] {
    switch (action) {
      case 'iterate': {
        this.#previousCharacter = this.#currentCharacter
        this.#currentCharacter = ''

        return null
      }

      case 'commit-character': {
        this.#currentValue += this.#currentCharacter

        return this.#action('iterate')
      }

      case 'uncommit-character': {
        this.#currentValue = this.#currentValue.substring(0, this.#currentValue.length - 1)

        return this.#action('iterate')
      }

      case 'commit-value': {
        this.#currentRecord.push(this.#currentValue)

        this.#isInQuote = false
        this.#currentCharacter = ''
        this.#previousCharacter = ''
        this.#currentValue = ''

        return null
      }

      case 'commit-record': {
        this.#action('commit-value')

        const record = this.#currentRecord

        this.#action('reset')

        return record
      }

      case 'reset': {
        this.#isInQuote = false
        this.#currentCharacter = ''
        this.#previousCharacter = ''
        this.#currentValue = ''
        this.#currentRecord = []

        return null
      }
    }
  }

  decodeCharacter(character: string | null): string[] | null {
    this.#currentCharacter = character

    console.log(
      JSON.stringify(
        {
          isInQuote: this.#isInQuote,
          currentCharacter: this.#currentCharacter,
          previousCharacter: this.#previousCharacter,
          currentValue: this.#currentValue,
          currentRecord: this.#currentRecord,
        },
        null,
        2
      )
    )

    if (character === null) {
      if (this.#previousCharacter) {
        return this.#action('commit-record')
      } else {
      }
    }

    // line break
    if (!this.#isInQuote && this.#currentCharacter === '\n') {
      if (this.#previousCharacter === '\r') {
        this.#action('uncommit-character')
      }
      return this.#action('commit-record')
    }

    // empty quoted value
    if (
      this.#previousCharacter === '"' &&
      this.#currentCharacter === '"' &&
      this.#currentValue === ''
    ) {
      this.#isInQuote = false
      return this.#action('iterate')
    }

    // escaped quote
    if (!this.#isInQuote && this.#previousCharacter === '"' && this.#currentCharacter === '"') {
      this.#isInQuote = true
      return this.#action('commit-character')
    }

    // quote
    if (this.#isInQuote && this.#currentCharacter === '"') {
      this.#isInQuote = false
      return this.#action('iterate')
    }

    if (!this.#isInQuote && this.#currentCharacter === '"') {
      this.#isInQuote = true
      return this.#action('iterate')
    }

    if (!this.#isInQuote && this.#currentCharacter === ',') {
      return this.#action('commit-value')
    }

    return this.#action('commit-character')
  }
}

export class CSVDecoderStream extends TransformStream<string, string[]> {
  constructor() {
    const decoder = new CSVDecoder()

    super({
      transform(chunk, controller) {
        for (const character of chunk) {
          const record = decoder.decodeCharacter(character)

          if (record) {
            controller.enqueue(record)
          }
        }
      },
      flush(controller) {
        const record = decoder.decodeCharacter(null)

        if (record) {
          controller.enqueue(record)
        }
      },
    })
  }
}

export class CSVObjectDecoder {
  #header!: string[]

  decode(record: string[]): object[] {
    if (!this.#header) {
      this.#header = record
      return []
    }

    const object = Object.create(null)

    for (let index = 0; index < record.length; index++) {
      const property = this.#header[index]
      const value = record[index]

      object[property] = value
    }

    return [object]
  }
}

export class CSVObjectDecoderStream extends TransformStream<string[], object> {
  constructor() {
    const decoder = new CSVObjectDecoder()

    super({
      transform(chunk, controller) {
        for (const entry of decoder.decode(chunk)) {
          controller.enqueue(entry)
        }
      },
    })
  }
}
