export const otherTraitsList = ['Attack', 'Surprise', 'Ongoing', 'Wildcard']

export function isOtherTrait(name: string): boolean {
  return otherTraitsList.includes(name)
}
