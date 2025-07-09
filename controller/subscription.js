const Subscription = require("../model/subscription");
const Users = require("../model/users");
const errorHandler = require("../utils/error_handler");

const updateSubscription = errorHandler(async (req, res) => {
  const userId = req.user.id;
  const { plan, paymentMethod = 'manual' } = req.body;

  const plansConfig = {
    free: { price: 0, productLimit: 3, canPinProduct: false },
    pro: { price: 10, productLimit: 10, canPinProduct: false },
    enterprise: { price: 25, productLimit: 1000, canPinProduct: true },
  };

  if (!plansConfig[plan]) {
    return res.status(400).json({ message: 'الخطة غير مدعومة' });
  }

  const { price, productLimit, canPinProduct } = plansConfig[plan];
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30);

  let subscription = await Subscription.findOne({ userId });

  if (!subscription) {
    subscription = new Subscription({
      userId,
      plan,
      startDate,
      endDate,
      price,
      productLimit,
      canPinProduct,
      paymentMethod,
      isActive: true,
    });
  } else {
    subscription.plan = plan;
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.price = price;
    subscription.productLimit = productLimit;
    subscription.canPinProduct = canPinProduct;
    subscription.paymentMethod = paymentMethod;
    subscription.isActive = true;
  }

  await subscription.save();
  await Users.findByIdAndUpdate(userId, { subscription: subscription._id });

  res.status(200).json({
    message: '✅ تم تحديث الاشتراك بنجاح',
    subscription,
  });
});


const getPlans = errorHandler(async (req, res) => {
  const plans = [
    {
      plan: 'free',
      name: 'الخطة المجانية',
      price: 0,
      productLimit: 3,
      canPinProduct: false,
      description: 'يمكنك نشر 3 منتجات أسبوعيًا بدون إمكانية التثبيت.',
    },
    {
      plan: 'pro',
      name: 'الخطة الاحترافية',
      price: 10,
      productLimit: 10,
      canPinProduct: false,
      description: 'نشر حتى 10 منتجات أسبوعيًا، بدون تثبيت.',
    },
    {
      plan: 'enterprise',
      name: 'خطة الشركات',
      price: 25,
      productLimit: 1000,
      canPinProduct: true,
      description: 'نشر عدد كبير من المنتجات وإمكانية تثبيت المنتج في الأعلى.',
    },
  ];

  res.status(200).json({
    message: '📦 قائمة الخطط المتاحة',
    plans,
  });
});

const getAllSubscriptions = errorHandler(async (req, res) => {
  const subscriptions = await Subscription.find().populate('userId', 'name email');
  res.status(200).json({ subscriptions });
});

module.exports = {
          updateSubscription,
          getPlans,
          getAllSubscriptions
}