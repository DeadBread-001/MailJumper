export const characterParts = {
    bodies: ['body1.png', 'body2.png'],
    hats: ['hat1.png', 'hat2.png'],
};

export function getSelectedCharacter() {
    const body =
        localStorage.getItem('characterBody') || characterParts.bodies[0];
    const hat = localStorage.getItem('characterHat') || characterParts.hats[0];
    return { body, hat };
}

export function setSelectedCharacter(body, hat) {
    localStorage.setItem('characterBody', body);
    localStorage.setItem('characterHat', hat);
}
