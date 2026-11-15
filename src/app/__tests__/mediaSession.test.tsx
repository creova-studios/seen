import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { PlaybackProvider, usePlayback, type Track } from "../playback/PlaybackProvider";
import { MediaSessionBridge, mediaMetadata } from "../playback/MediaSessionBridge";

const track: Track = { storyId: "s1", chapterId: "c1", title: "The First Note", artist: "Kira Chen", text: "One. Two. Three.", lang: "en", coverImage: "https://img/x.jpg" };

describe("mediaMetadata", () => {
  it("names the chapter, the creator and the cover, with safe defaults", () => {
    expect(mediaMetadata(track)).toMatchObject({ title: "The First Note", artist: "Kira Chen", artwork: [{ src: "https://img/x.jpg" }] });
    expect(mediaMetadata({ ...track, artist: undefined, coverImage: undefined })).toMatchObject({ artist: "SEEN", artwork: [] });
  });
});

describe("MediaSessionBridge", () => {
  const handlers: Record<string, ((d: { seekTime?: number }) => void) | null> = {};
  const session = { metadata: null as unknown, playbackState: "none", setActionHandler: vi.fn((a: string, h: never) => { handlers[a] = h; }), setPositionState: vi.fn() };
  let api: ReturnType<typeof usePlayback>;
  const Probe = () => { api = usePlayback(); return null; };

  beforeEach(() => {
    for (const k of Object.keys(handlers)) delete handlers[k];
    session.metadata = null;
    session.playbackState = "none";
    Object.defineProperty(navigator, "mediaSession", { value: session, configurable: true });
    (window as unknown as { MediaMetadata: unknown }).MediaMetadata = class { constructor(public init: object) { Object.assign(this, init); } };
  });
  afterEach(() => { delete (navigator as unknown as { mediaSession?: unknown }).mediaSession; });

  const mount = () => render(<PlaybackProvider><MediaSessionBridge /><Probe /></PlaybackProvider>);

  it("shows the track on the lock screen once something is loaded, and registers the buttons", () => {
    mount();
    expect(session.metadata).toBeNull();
    act(() => api.load(track));
    expect(session.metadata).toMatchObject({ title: "The First Note", artist: "Kira Chen" });
    for (const a of ["play", "pause", "stop", "seekbackward", "seekforward", "seekto"]) expect(handlers[a], a).toBeTypeOf("function");
  });

  it("the lock-screen play and pause buttons reach the player without errors", () => {
    mount();
    act(() => api.load(track));
    expect(() => act(() => { handlers.play!({}); handlers.pause!({}); handlers.seekforward!({}); handlers.seekbackward!({}); handlers.seekto!({ seekTime: 5 }); })).not.toThrow();
  });

  it("does nothing, without errors, where Media Session does not exist", () => {
    delete (navigator as unknown as { mediaSession?: unknown }).mediaSession;
    expect(() => { mount(); act(() => api.load(track)); }).not.toThrow();
  });
});
