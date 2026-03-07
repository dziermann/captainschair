export const species = [
  "Alien",
  "Andorian",
  "Android",
  "Bajoran",
  "Betazoid",
  "Cardassian",
  "Changeling",
  "Ferengi",
  "Human",
  "Kelpien",
  "Klingon",
  "Orion",
  "Pakled",
  "Romulan",
  "Synthetic",
  "Tellarite",
  "Trill",
  "Vulcan",
  "Xindi",
  "Breen",
]

export function isSpecies(name: string): boolean {
  return species.includes(name)
}