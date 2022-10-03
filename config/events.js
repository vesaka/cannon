const main = {
    game: ['loaded', 'over', 'destroy', 'clear', 'ready', 'start', 'reset'],
    background: ['loaded', 'failed'],
    locale: ['loaded'],
    window: ['resize', 'orientationchange']
};

const game = {
    character: ['ready', 'start', 'scores'],
    bunny: ['loaded'],
    font: ['loaded'],
    obstacles: ['loaded'],
    obstacle: ['loaded', 'coming']
};

const obstacles = {
    obstacle: ['loaded']
};

const texture = {
    background: ['loaded', 'failed']
};
const character = {
    window: ['resize']
};
export default {};
export { main, game, texture, character, obstacles };