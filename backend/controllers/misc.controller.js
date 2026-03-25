export const health = (req, res) => {
  res.json({ status: 'ok', message: 'MedSmart API is running' });
};

export const getLocations = (req, res) => {
  res.json({
    countries: ['India'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka', 'Delhi'],
    cities: {
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
      'Karnataka': ['Bangalore', 'Mysore'],
      'Delhi': ['New Delhi']
    }
  });
};
