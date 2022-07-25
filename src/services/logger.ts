export class LoggerStream<T> extends TransformStream<T, T> {
  constructor() {
    super({
      transform(chunk, controller) {
        console.log(chunk)
        controller.enqueue(chunk)
      },
    })
  }
}
