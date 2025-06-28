const {
  Trip,
  Omra,
  Booking,
  VipOmra,
  Transfer,
  HotelBookingModel,
  Banner,
  Ferry,
  Flight,
} = require("../models");





// TOTAL STATISTICS
// @desc    Get overall dashboard statistics
// @route   GET /api/statistics/total
exports.getTotalStatistics = async (req, res) => {
  try {
    const totalTrips = await Trip.countDocuments();
    const totalOmras = await Omra.countDocuments();
    const totalVipOmras = await VipOmra.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalTransfers = await Transfer.countDocuments();
    const totalHotelBookings = await HotelBookingModel.countDocuments();
    const totalFerries = await Ferry.countDocuments();
    const totalFlights = await Flight.countDocuments();
    const totalBanners = await Banner.countDocuments();

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = {
      newBookings: await Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      }),
      newTrips: await Trip.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      }),
      newOmras: await Omra.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      }),
      newTransfers: await Transfer.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      }),
      newHotelBookings: await HotelBookingModel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      }),
      newFerries: await Ferry.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }, 
      }),
      newFlights: await Flight.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }, 
      }),
      newVipOmras: await VipOmra.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },  
      })
    };

    res.status(200).json({
      totalCounts: {
        totalTrips,
        totalOmras,
        totalVipOmras,
        totalBookings,
        totalTransfers,
        totalHotelBookings,
        totalFerries,
        totalFlights,
        totalBanners,
      },
      recentActivity,
      summary: {
        totalServices:
          totalTrips +
          totalOmras ,
        totalRequests:
          totalTransfers +
          totalFerries +
          totalFlights +
          totalVipOmras,
        totalBookings: totalBookings,
        totalHotelBookings: totalHotelBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching total statistics:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// HOTEL STATISTICS
// @desc    Get Hotel booking statistics
// @route   GET /api/statistics/hotels
exports.getHotelStatistics = async (req, res) => {
  try {
    const totalHotelBookings = await HotelBookingModel.countDocuments();

    // Hotel bookings by status
    const bookingsByStatus = await HotelBookingModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Hotel bookings by payment status
    const bookingsByPaymentStatus = await HotelBookingModel.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Monthly hotel bookings
    const currentYear = new Date().getFullYear();
    const monthlyBookings = await HotelBookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Popular destinations
    const popularDestinations = await HotelBookingModel.aggregate([
      {
        $group: {
          _id: "$hotelInfo.city",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Average booking duration
    const avgBookingDuration = await HotelBookingModel.aggregate([
      {
        $project: {
          duration: {
            $divide: [
              {
                $subtract: [
                  "$hotelInfo.checkOutDate",
                  "$hotelInfo.checkInDate",
                ],
              },
              1000 * 60 * 60 * 24, // Convert milliseconds to days
            ],
          },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
          avgNightlyRate: { $avg: { $divide: ["$totalPrice", "$duration"] } },
        },
      },
    ]);

    // Revenue statistics
    const revenueStats = await HotelBookingModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          averageBookingValue: { $avg: "$totalPrice" },
          maxBookingValue: { $max: "$totalPrice" },
          minBookingValue: { $min: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      totalHotelBookings,
      bookingsByStatus,
      bookingsByPaymentStatus,
      monthlyBookings,
      popularDestinations,
      avgBookingDuration: avgBookingDuration[0] || {
        avgDuration: 0,
        avgNightlyRate: 0,
      },
      revenueStats: revenueStats[0] || {
        totalRevenue: 0,
        averageBookingValue: 0,
        maxBookingValue: 0,
        minBookingValue: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching Hotel statistics:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// BOOKING STATISTICS
// @desc    Get general booking statistics
// @route   GET /api/statistics/bookings
exports.getBookingStatistics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    // Monthly bookings trend
    const currentYear = new Date().getFullYear();
    const monthlyBookingsTrend = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Recent bookings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Booking conversion rate (confirmed vs total)
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });
    const conversionRate =
      totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

    res.status(200).json({
      totalBookings,
      confirmedBookings,
      conversionRate: Math.round(conversionRate * 100) / 100, // Round to 2 decimal places
      recentBookings,
      bookingsByStatus,
      bookingsByType,
      monthlyBookingsTrend,
    });
  } catch (error) {
    console.error("Error fetching Booking statistics:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// DASHBOARD OVERVIEW
// @desc    Get dashboard overview with key metrics
// @route   GET /api/statistics/dashboard
exports.getDashboardOverview = async (req, res) => {
  try {
    // Get current date ranges
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    // Key metrics for current month
    const thisMonthStats = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: thisMonth } }),
      HotelBookingModel.countDocuments({ createdAt: { $gte: thisMonth } }),
    ]);

    // Key metrics for last month (for comparison)
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const lastMonthStats = await Promise.all([
      Booking.countDocuments({
        createdAt: { $gte: lastMonth, $lte: lastMonthEnd },
      }),
      HotelBookingModel.countDocuments({
        createdAt: { $gte: lastMonth, $lte: lastMonthEnd },
      }),
    ]);

    // Calculate percentage changes
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Revenue for current month
    const monthlyRevenue = await Promise.all([
      Booking.aggregate([
        { $match: { createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      HotelBookingModel.aggregate([
        { $match: { createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const totalMonthlyRevenue = monthlyRevenue.reduce((sum, revenue) => {
      return sum + (revenue[0]?.total || 0);
    }, 0);

    res.status(200).json({
      keyMetrics: {
        totalBookings: {
          current: thisMonthStats[0],
          previous: lastMonthStats[0],
          change: calculatePercentageChange(
            thisMonthStats[0],
            lastMonthStats[0]
          ),
        },
        hotelBookings: {
          current: thisMonthStats[1],
          previous: lastMonthStats[1],
          change: calculatePercentageChange(
            thisMonthStats[1],
            lastMonthStats[1]
          ),
        },
      },
      monthlyRevenue: totalMonthlyRevenue,
      period: {
        currentMonth: thisMonth.toISOString(),
        currentYear: thisYear.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
