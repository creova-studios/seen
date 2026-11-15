// "Make a SEEN": story seeds for the interactive toy. seeds[outputLanguage][feeling][form]
// feeling: 0 quiet, 1 bold, 2 tender   form: 0 story, 1 song, 2 film
// Shared by every page language because the visitor chooses the output language separately.
// Original lines, deliberately universal: no real people, communities or cultural material.
export const seeds = {
  en: [
    ["A story about the one room in your house that never gets loud.", "A song for the hour just before everyone wakes.", "A film that is only the light moving across one kitchen table."],
    ["A story that begins with you saying the thing out loud.", "A song that takes up the whole street.", "A film whose first shot is the last thing anyone expected."],
    ["A story about someone who remembers your name correctly.", "A song for the person who stayed.", "A film made of hands: cooking, mending, waving goodbye."],
  ],
  fr: [
    ["Une histoire sur la seule pièce de la maison qui ne devient jamais bruyante.", "Une chanson pour l'heure juste avant que tout le monde se réveille.", "Un film qui n'est que la lumière qui traverse une table de cuisine."],
    ["Une histoire qui commence par vous, qui dites la chose à voix haute.", "Une chanson qui prend toute la rue.", "Un film dont le premier plan est ce que personne n'attendait."],
    ["Une histoire sur quelqu'un qui retient correctement votre nom.", "Une chanson pour la personne qui est restée.", "Un film fait de mains : qui cuisinent, qui réparent, qui disent au revoir."],
  ],
  es: [
    ["Una historia sobre la única habitación de tu casa que nunca se pone ruidosa.", "Una canción para la hora justo antes de que todos despierten.", "Una película que es solo la luz cruzando una mesa de cocina."],
    ["Una historia que empieza contigo diciendo la cosa en voz alta.", "Una canción que ocupa toda la calle.", "Una película cuyo primer plano es lo que nadie esperaba."],
    ["Una historia sobre alguien que recuerda bien tu nombre.", "Una canción para la persona que se quedó.", "Una película hecha de manos: cocinando, remendando, diciendo adiós."],
  ],
};
