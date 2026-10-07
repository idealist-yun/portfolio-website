export type BodyItem =
  | string
  | { img: string }
  | { sub: string }
  | { list: string[] }
  | { yt: string }
  | { embed: "vip-robot-sim" }
  | { link: { label: string; href: string } };

export type Section = { heading: string; body: BodyItem[] };
