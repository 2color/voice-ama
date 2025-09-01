import { PrismaClient } from '@prisma/client/edge'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  const question = await prisma.ama.createMany({
    data: [
      {
        id: 'SaeiyvYn8qPVNA9dA7XM',
        question: 'What developer tools do you like?',
        status: 'ANSWERED',
        createdAt: new Date(2021, 9, 24),
        reactions: 99,
        audioUrl: `https://res.cloudinary.com/dnorman/video/upload/v1635067987/prisma-ama/blob_trvtxk.mp4`,
        audioPlayCount: 0,
        audioWaveform: [
          0.4439851928683355, 0.4175636233456092, 0.49300675742528033,
          0.28725539459503496, 0.3917554895232208, 0.1433387543356024,
          0.13934902638619195, 0.17770465900167162, 0.4354456016332648,
          0.6023665471486541, 0.2757193018742864, 0.3136246930160106,
          0.3546221695735921, 0.40785270655436223, 0.5166649850341927,
          0.277499273482132, 0.40496976143451463, 0.7324529541110762,
          0.29361049793815847, 0.21305952446052984, 0.2613484543376258,
          0.17380371601583422, 0.14236725470673747, 0.48321891643786247,
          0.09140270260043784, 0.02818915185793713, 1, 0.4422777508813754,
          0.614836616769465, 0.22749028087356823, 0.3147161451187268,
          0.2806061343173829, 0.27455410088559584, 0.30108059919286195,
          0.13029873477146028, 0.22523107823612437, 0.550707005297114,
          0.4111818210787724, 0.3164855201827074, 0.3290139316855621,
          0.28375986173004974, 0.24431393182633357, 0.5634913577640411,
          0.37527587701294374, 0.07875844700430717, 0.282695977077529,
          0.608341725272603, 0.3045050148242204, 0.25433589503081394,
          0.27187999311757927, 0.2902219891021231, 0.27035427691069536,
          0.127127478480891, 0.8201039170482582, 0.44331835346006665,
          0.5071852820353554, 0.1605504686546733, 0.2290139308945534,
          0.1628932918950401, 0.046233695780881566, 0.334982728011645,
          0.4347655780299091, 0.3989087296461778, 0.40501571304091494,
        ],
      },
      {
        id: 'i7QvpXiVBwY9LSEUOypW',
        question: 'What is zero-cost type safety?',
        status: 'ANSWERED',
        answer: `Type safety with databases is a way to ensure that application code interacting with the database can only do so safely. Moreover, the return type for the query is always inferred for you, even when fetching relations.\n\nFor example, attempting to query a non-existent column will immediately raise a type error:\n\n![demo](https://i.imgur.com/bMifTx7.gif)\n\n[Prisma](https://www.prisma.io/) gives you type safety at zero cost by generating TypeScript types for you. That way, you don't have burden of manually defining types based on your database schema.`,
        createdAt: new Date(2021, 9, 25),
        reactions: 177,
        audioUrl: null,
        audioPlayCount: 0,
      },
      {
        id: 'GBqXMxobnCqpKHCju5L2',
        question: 'How did you build this AMA page?',
        status: 'ANSWERED',
        answer: `With Next.js, React Query, Prisma with The Prisma Data Proxy, MySQL, and Cloudinary for uploading and serving the audio.\n\nThe app is based on Brian Lovin's [AMA page](https://brianlovin.com/ama).\n\n[The Prisma Data Proxy](https://youtu.be/iyGZ8JFPgoY) saves you from crushing your database by exhausting the DB's connection limit and makes it a breeze to use DBs in Vercel serverless functions.`,
        createdAt: new Date(2021, 9, 26),
        reactions: 132,
        audioUrl:
          'https://res.cloudinary.com/dnorman/video/upload/v1634140061/prisma-ama/blob_bizfqc.mp4',
        audioPlayCount: 0,
        audioWaveform: [
          0.07731139591765855, 0.08592482355986636, 0.5231937460810483,
          0.5019074333975564, 0.8386196897871602, 0.8887483912220179,
          0.5233046766085991, 0.11366832797393468, 0.4900036384755124, 1,
          0.939766824069911, 0.20297692450556745, 0.5284501579422637,
          0.15016302394036304, 0.8836488413081807, 0.2285648320919248,
          0.5652668364963717, 0.5692059944492195, 0.22575567876808736,
          0.5624175177540507, 0.26069888824370696, 0.4897029114230371,
          0.022925370081108665, 0.25179559187116657, 0.9935161741098106,
          0.43403585609282014, 0.12742030650892017, 0.5883828535047273,
          0.10522090498942988, 0.09746846993556742, 0.011345842201422063,
          0.01749097304703671, 0.7087100884764249, 0.6272384136701296,
          0.6972595193385394, 0.44205326576915344, 0.2749163160668859,
          0.32810741275909727, 0.6189952102847346, 0.20161700458564305,
          0.1689411864374279, 0.1977933407265926, 0.17530078603103277,
          0.16091971106662817, 0.3526126031317392, 0.6099911471272611,
          0.22258456269388144, 0.22678723919499633, 0.6587131107460326,
          0.16320630396471805, 0.12991817263890218, 0.1823150760822439,
          0.45162557808655784, 0.24471998515828225, 0.3282929024732144,
          0.111741427908911, 0.16259156466853691, 0.3119195804112516,
          0.2903625345793421, 0.3703950812144551, 0.09063279852787064,
          0.01974654577937857, 0.000536691957079822, 0.0018761994991794765,
        ],
      },
    ],
  })
  console.log(`Created ${question.count} AMAs`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
