const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About LUMI</h1>
        <p className="text-xl max-w-2xl mx-auto px-4 opacity-90">Building the future of e-commerce, one product at a time.</p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg mx-auto text-gray-600">
          <p className="mb-6">
            Welcome to LUMI, your number one source for all things premium. We're dedicated to giving you the very best products, with a focus on dependability, customer service and uniqueness.
          </p>
          <p className="mb-6">
            Founded in 2024, LUMI has come a long way from its beginnings. When we first started out, our passion for eco-friendly and quality products drove us to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online store. We now serve customers all over the world, and are thrilled to be a part of the quirky, fair-trade wing of the e-commerce industry.
          </p>
          <p className="mb-6">
            We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
          </p>
          <div className="mt-12 bg-gray-50 p-8 rounded-lg border border-gray-100 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
            <p>To provide high-quality, sustainable products that enhance your daily life while providing an exceptional shopping experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
