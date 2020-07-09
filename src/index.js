import Discord from "discord.js";
import DotEnv from "dotenv";
import cron from "node-cron";
import mongoose from "mongoose";
import Checkouter from "./model/checkouter";

DotEnv.config();
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DB_URI = process.env.DB_URI;
const client = new Discord.Client();

const ROLE_IDS = {
  checkouter: "728706007873749076",
};

const CHANNEL_IDS = {
  resenha: "682752774974603336",
  bolsa: "728743614963777577",
  planning: "730141036655018104",
};

const CRONS = {
  fourTwenty: (ch) =>
    createCronMsg("20 16 * * 1-5", () =>
      ch.send(`<@&${ROLE_IDS.checkouter}> 4:20, hora do café do Thiagão!`)
    ),
  daily: (ch) =>
    createCronMsg("0 15 * * 1-5", () =>
      ch.send(`<@&${ROLE_IDS.checkouter}> Partiu daily!!`)
    ),
  pulses: (ch) =>
    createCronMsg("* 10-19 * * 1", () =>
      ch.send(
        `<@&${ROLE_IDS.checkouter}> Já respondeu o seu pulses hoje? https://www.pulses.com.br/app/engage/`
      )
    ),
  luckyTega: (ch) => {
    createCronMsg("0 10-19 * * 1-5", async () => {
      if (Math.round(Math.random() * 100) <= 5) {
        const checkouters = await Checkouter.find();
        const checkoutersTotal = checkouters.length;
        const luckyCheckouterIndex = Math.floor(
          Math.random() * checkoutersTotal
        );
        const luckyCheckouter = await Checkouter.findOneAndUpdate(
          { discordId: checkouters[luckyCheckouterIndex].discordId },
          { $inc: { tegaCount: 1 } },
          { new: true }
        );
        ch.send(
          `<@${luckyCheckouter.discordId}> recebeu um TEGA da sorte aleatório, parabéns!!`
        );
      }
    });
  },
};

const COMMANDS = {
  register: async (msg) => {
    try {
      await Checkouter.create({
        name: msg.member.displayName,
        discordId: msg.member.id,
      });
      msg.reply("cadastrado(a) com sucesso!!");
    } catch (error) {
      msg.reply("Deu ruim na hora de cadastrar o usuário!");
    }
  },
  luckyTega: async (msg) => {
    const checkouters = await Checkouter.find();
    const totalTegas = checkouters.reduce((acc, curr) => acc + curr.tegaCount, 0);
    const checkoutersTotal = checkouters.length;
    const averageTegas = totalTegas / checkoutersTotal;

    const messagingCheckouter = checkouters.find(cktr => cktr.discordId === msg.member.id);
    const messagingCheckouterTegaCount = messagingCheckouter.tegaCount > 0 ? messagingCheckouter.tegaCount : 1;

    const LUCKY_BALANCER = averageTegas / messagingCheckouterTegaCount;

    const LUCKY_NUMBER = Math.random() * 100;
    const CHANCE = 5 * LUCKY_BALANCER;
    const RARE_CASE = 0.01 * LUCKY_BALANCER;

    if (msg.content.includes("qual minha tegaChance?")) {
      msg.reply(
        `Sua chance é de ${CHANCE.toFixed(3)}%`
      );
    }
  
    // por faovr, se você ver esse código, não espalhe que tem esse caso especial com chance de 0.01%
    // no dia que sair todos vamos rir bastante e comemorar :) prometo folga pra quem tirar... 
    if (LUCKY_NUMBER <= RARE_CASE) {
      try {
        const checkouter = await Checkouter.findOneAndUpdate(
          { discordId: msg.member.id },
          { $inc: { tegaCount: 10 } },
          { new: true }
        );
  
        msg.reply(
          `Sei que é difícil de acreditar, mas sua mensagem foi premiada com o FRUTO PROIBIDO do COSTÃO!\n\nAgora vc tem ${checkouter.tegaCount} TEGAS!\n\nSão 10 tegas a mais em uma porcentagem de ${RARE_CASE.toFixed(4)}%\n\nQUE BRABX!!!`
        );
      } catch (error) {
        console.log("Error on adding lucky tega.", error);
      }
    } else if (LUCKY_NUMBER <= CHANCE) {
      try {
        const checkouter = await Checkouter.findOneAndUpdate(
          { discordId: msg.member.id },
          { $inc: { tegaCount: 1 } },
          { new: true }
        );
  
        msg.reply(
          `sua mensagem foi premiada com o tega da sorte! Agora vc tem ${checkouter.tegaCount} TEGAS!`
        );
      } catch (error) {
        console.log("Error on adding lucky tega.", error);
      }
    } else if(LUCKY_NUMBER <= 5){
      msg.reply(
        `Você QUASE foi premiada com o tega da sorte!\n\nsua chance é de ${CHANCE.toFixed(2)}% e o numero sorteado foi ${LUCKY_NUMBER.toFixed(3)}\n\n:aham:`
      );
    } else if(LUCKY_NUMBER <= 10){
      msg.reply(
        `Ta sentindo o cheirinho?? tem ganhador chegando aqui!\n\nsua chance é de ${CHANCE.toFixed(2)}% e o numero sorteado foi ${LUCKY_NUMBER.toFixed(3)}\n\nIsso significa que o ganhador não foi você :genio:`
      );
    }
  },
  tegaRank: async (msg) => {
    try {
      const rank = await Checkouter.find().sort({ tegaCount: -1 });
      const rankMsg = rank.reduce((acc, checkouter, index) => {
        return (
          acc +
          `\n ${index + 1}˚ ${checkouter.name} - Tegas: ${checkouter.tegaCount}`
        );
      }, "");
      msg.reply(rankMsg);
    } catch (error) {
      msg.reply("Deu ruim na hora de cadastrar o usuário!");
    }
  },
};

client.on("ready", async () => {
  console.log("Bot is running...");
  mongoose
    .connect(DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(console.log("DB connected!"))
    .catch(console.error);

  const resenhaChannel = await client.channels.fetch(CHANNEL_IDS.resenha);
  const planningChannel = await client.channels.fetch(CHANNEL_IDS.planning);
  const bolsaChannel = await client.channels.fetch(CHANNEL_IDS.bolsa);

  CRONS.fourTwenty(resenhaChannel);
  CRONS.pulses(resenhaChannel);
  CRONS.daily(planningChannel);
  CRONS.luckyTega(resenhaChannel);
});

client.on("message", async (msg) => {
  if (msg.content.includes("!cb")) {
    const code = msg.content.split(" ")[1];
    if (code === "register") COMMANDS.register(msg);
    if (code === "tegaRank") COMMANDS.tegaRank(msg);
  }

  if (
    msg.member.roles.cache.has(ROLE_IDS.checkouter)
  )
    COMMANDS.luckyTega(msg);
});

client.login(DISCORD_BOT_TOKEN);

const createCronMsg = (scheduled, cronFn) =>
  cron.schedule(scheduled, cronFn, {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  });
