const mineflayer = require('mineflayer');

const serverHost = '92.63.189.147';
const serverPort = 25565;

const FOODS = [
    "cooked_beef", "cooked_porkchop", "cooked_mutton", "cooked_chicken",
    "cooked_rabbit", "cooked_salmon", "cooked_cod", "bread",
    "apple", "golden_apple", "enchanted_golden_apple",
    "carrot", "baked_potato", "pumpkin_pie",
    "mushroom_stew", "rabbit_stew", "beetroot_soup",
    "melon_slice", "sweet_berries", "honey_bottle",
    "dried_kelp", "cookie"
];

function startBot() {
    console.log(`[ULANISH] afker_uz ulanmoqda...`);

    const bot = mineflayer.createBot({
        host: serverHost,
        port: serverPort,
        username: 'afker_uz',
        version: '1.18.2',
        hideErrors: true,
        connectTimeout: 60000,
        keepAlive: true
    });

    let attackInterval = null;
    let eatInterval = null;

    const goToAnarchy = () => {
        if (bot.entity) {
            bot.chat('/server anarxiya2');
            console.log(`[SERVER] anarxiya2 ga o'tilmoqda...`);
        }
    };

    bot.on('messagestr', (msg) => {
        const cleanMsg = msg.trim().toLowerCase();

        if (cleanMsg.includes('/login') || cleanMsg.includes('login') || cleanMsg.includes('tizimga kirish')) {
            bot.chat('/login shukrona');
            console.log('[LOGIN] Login yuborildi.');
            return;
        }

        if (cleanMsg.includes('hub') || cleanMsg.includes('lobby') || cleanMsg.includes('articraft') || cleanMsg.includes('xush kelibsiz')) {
            stopAll();
            setTimeout(goToAnarchy, 10000);
        }

        if (cleanMsg.includes('anarxiya') || cleanMsg.includes('anarchy')) {
            setTimeout(() => {
                startAttack();
                startAutoEat();
            }, 3000);
        }
    });

    bot.on('spawn', () => {
        console.log(`[OK] Bot spawn bo'ldi.`);
        stopAll();

        setTimeout(() => {
            goToAnarchy();
            setTimeout(() => {
                startAttack();
                startAutoEat();
            }, 13000);
        }, 15000);

        setInterval(() => {
            goToAnarchy();
        }, 300000);
    });

    function startAttack() {
        if (attackInterval) clearInterval(attackInterval);
        console.log('[CLICKER] Avto-urish boshlandi!');

        attackInterval = setInterval(() => {
            const target = bot.nearestEntity(e => {
                if (e.id === bot.entity.id) return false;
                const dist = e.position.distanceTo(bot.entity.position);
                if (dist > 3.5) return false;

                const dx = e.position.x - bot.entity.position.x;
                const dz = e.position.z - bot.entity.position.z;
                const yaw = bot.entity.yaw;
                const forwardX = -Math.sin(yaw);
                const forwardZ = -Math.cos(yaw);
                const dot = dx * forwardX + dz * forwardZ;

                return dot > 0;
            });

            if (target) {
                console.log(`[HIT] ${target.username || target.name || target.type}`);
                bot.swingArm();
                bot.attack(target);
            } else {
                bot.swingArm();
            }
        }, 3000);
    }

    function startAutoEat() {
        if (eatInterval) clearInterval(eatInterval);
        console.log('[EAT] Auto-eat boshlandi!');

        eatInterval = setInterval(async () => {
            if (bot.food <= 14) {
                const foodItem = bot.inventory.items().find(i => FOODS.includes(i.name));
                if (foodItem) {
                    try {
                        await bot.equip(foodItem, "hand");
                        await bot.consume();
                        console.log(`[EAT] ${foodItem.name} yeyildi! (${bot.food}/20)`);
                    } catch (e) {}
                }
            }
        }, 2000);
    }

    function stopAll() {
        if (attackInterval) { clearInterval(attackInterval); attackInterval = null; }
        if (eatInterval) { clearInterval(eatInterval); eatInterval = null; }
        console.log('[STOP] Clicker va eat to\'xtatildi.');
    }

    bot.on('end', (reason) => {
        console.log(`[!] Bot uzildi. 30 soniyadan keyin qayta kiradi...`);
        stopAll();
        setTimeout(() => startBot(), 30000);
    });

    bot.on('error', (err) => console.log(`[ERR] ${err.message}`));
}

startBot();
