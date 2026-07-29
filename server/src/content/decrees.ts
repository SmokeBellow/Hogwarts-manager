export interface Decree {
  id: "loyalty" | "courage" | "justice" | "ambition";
  title: string;
  description: string;
}

// The founders' shared, dormant right: one binding order to the school
// itself, earned by completing the Trial matching one of the four house
// virtues in its true spirit. Awarded at graduation based on which of the
// four root story moments the player chose to act on, and how.
export const decrees: Decree[] = [
  {
    id: "loyalty",
    title: "«Не дай забыть»",
    description:
      "Школа обязана навсегда защищать тех, кого некому защитить — отныне ни один студент без имени, денег и связей не останется один на один с несправедливым обвинением.",
  },
  {
    id: "courage",
    title: "«Восстанови честное имя»",
    description:
      "Школа обязана раз и навсегда снять груз того обвинения, что несправедливо пало на невиновного той ночью — открыто, в хрониках, без оговорок.",
  },
  {
    id: "justice",
    title: "«Запиши правду»",
    description:
      "Школа обязана хранить в архивах честную, задокументированную версию произошедшего — не то, что удобно рассказывать, а то, что было на самом деле.",
  },
  {
    id: "ambition",
    title: "«Впиши моё имя»",
    description:
      "Школа обязана навсегда закрепить твоё имя в своей истории — вне зависимости от того, как к этому отнесутся те, кто рядом.",
  },
];
