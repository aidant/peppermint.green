import { filter, fromEvent, map, merge, Observable, ReplaySubject, startWith } from 'rxjs'

export const createObservableNotification = <T extends string, E extends `${T}:${string}`>(
  name: `peppermint.green#${T}`
): [<T extends E>(type: T) => Observable<T>, (type: E) => void] => {
  const channel = new BroadcastChannel(name)
  const $notification = new ReplaySubject<E>(1)

  return [
    <T extends E>(type: T) =>
      merge(
        fromEvent<MessageEvent>(channel, 'message').pipe(map((e) => e.data as E)),
        $notification
      ).pipe(
        startWith(type),
        filter((event): event is T => event.startsWith(type))
      ),
    (type) => {
      channel.postMessage(type)
      $notification.next(type)
    },
  ]
}
