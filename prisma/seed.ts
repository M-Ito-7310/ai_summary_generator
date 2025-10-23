import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 統計テーブルの初期データ
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const analytics = await prisma.analytics.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      totalSummaries: 0,
      totalComments: 0,
      totalTokens: 0,
      avgProcessingTime: 0,
      uniqueUrls: 0,
    },
  });

  console.log('✅ Analytics seed data created:', analytics);

  // サンプルデータ（オプション）
  const sampleSummary = await prisma.summary.create({
    data: {
      url: 'https://example.com/sample-article',
      title: 'サンプル記事: AI技術の最新動向',
      description: 'AI技術の最新トレンドについて解説する記事です。',
      content:
        '最新のAI技術により、業務効率が大幅に向上しています。特に自然言語処理の分野では、人間レベルの理解が可能になりつつあります。今後5年でAI市場は3倍に成長すると予測されています。',
      author: 'サンプル著者',
      publishedAt: new Date(),
      summaryLines: [
        '最新のAI技術により、業務効率が大幅に向上している。',
        '特に自然言語処理の分野では、人間レベルの理解が可能に。',
        '今後5年でAI市場は3倍に成長すると予測されている。',
      ],
      summaryText:
        '最新のAI技術により、業務効率が大幅に向上している。特に自然言語処理の分野では、人間レベルの理解が可能に。今後5年でAI市場は3倍に成長すると予測されている。',
      tokensUsed: 1250,
      processingTime: 3500,
      comments: {
        create: [
          {
            text: 'AI技術の進化スピードに驚きました!特に自然言語処理の発展は、私たちの仕事にも大きな影響を与えそうですね。',
            tone: 'casual',
            length: 68,
            position: 1,
          },
          {
            text: '業務効率化の観点から見ても、AI導入は避けられない流れですね。早めに準備を始めたいと思います。',
            tone: 'casual',
            length: 58,
            position: 2,
          },
          {
            text: '市場が3倍成長というのは驚異的。この波に乗り遅れないよう、しっかり情報収集していきたいです。',
            tone: 'casual',
            length: 56,
            position: 3,
          },
        ],
      },
    },
    include: {
      comments: true,
    },
  });

  console.log('✅ Sample summary created:', sampleSummary);

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
