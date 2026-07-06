const Groq = require("groq-sdk");
const Car = require("../models/Car");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * بياخد العربيات المتاحة من الداتابيز
 * وبيبعتهم لـ Groq عشان يرشح المناسب
 */
const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    // جيب العربيات المتاحة من الداتابيز
    const cars = await Car.find({ available: true });

    // حوّل العربيات لنص مفهوم للـ AI
    const carsList = cars
      .map(
        (car) =>
          `- ${car.brand} ${car.name}: $${car.pricePerDay}/day, ${
            car.category
          }, ${car.seats} seats, ${
            car.transmission
          }, Features: ${car.features.join(", ")}`
      )
      .join("\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `أنت مساعد ذكي لشركة تأجير سيارات اسمها DriveWay.
مهمتك مساعدة الزبائن في اختيار السيارة المناسبة.
السيارات المتاحة دلوقتي:
${carsList}

قواعد مهمة:
- رد دايماً بالعربية
- رشح سيارة أو أكتر من القائمة بس
- اذكر السعر والمميزات
- كن ودود وقصير في ردودك`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('GROQ ERROR:', error.message);
    next(error);
  }
};

module.exports = { chat };
