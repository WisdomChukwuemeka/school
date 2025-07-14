export const Home = () => {
  const localData = [
  {
    id: 1,
    image: <i class="bi bi-person-workspace  text-white text-2xl rounded-full p-2 bg-red-700"></i>,
    title: "Dedicated Lecturers",
  },
  {
    id: 2,
    image: <i class="bi bi-globe  text-white text-2xl rounded-full p-2 bg-green-700"></i>,
    title: "Global Recognition",
  },
  {
    id: 3,
    image: <i class="bi bi-gear-wide  text-white text-2xl rounded-full p-2 bg-blue-700"></i>,
    title: "Modern Equipment",
  },
  {
    id: 4,
    image: <i class="bi bi-mortarboard-fill  text-white text-2xl rounded-full p-2 bg-green-700"></i>,
    title: "Career Prospects",
  },
  
];
  return(
    <>
      <div class='text-center'>
        <div class="bg-[url('../src/images/building.png')] bg-[linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5), )] aspect-[4/3] bg-cover bg-center bg-no-repeat">
          <div class="flex items-center justify-center h-full">
            <div class="flex flex-col items-center justify-center h-full text-white">
              <h1 class="text-4xl font-bold mb-4 text-center">Welcome to Our School</h1>
              <p class="text-lg mb6">Empowering Students for a Brighter Future</p>
              <a href="/register" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">Get Started</a>
              </div>
          </div>
        </div>

        <section>
          <div class='py-8 grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-15'>
            <div>
              <h2 class="text-3xl font-bold text-center my-8">Our Mission</h2>
              <p class="text-lg text-center max-w-2xl mx-auto">
                Our mission is to provide a nurturing and inclusive environment where students can thrive academically, socially, and emotionally. We are committed to fostering a love for learning and empowering our students to become responsible, compassionate, and successful individuals.
              </p>
            </div>
            <div class='relative p-10'>
              <div class="  bg-[url('../src/images/teacherone.png')] bg-cover bg-center bg-no-repeat rounded-2xl h-80 flex items-center justify-center">
                <div class="absolute bg-[url('../src/images/boy.png')] bg-cover bg-center bg-no-repeat rounded-2xl h-25 w-25 lg:h-40 
                lg:w-40 bottom-1 left-7 md:left-0 
                md:top-12 lg:left-0 lg:bottom-12 xl:left-0"></div>
                <div class="home_sectiontwo absolute 
                bg-[url('../src/images/girlandboy.png')] 
                bg-cover bg-center bg-no-repeat rounded-2xl 
                h-25 w-25 lg:h-40 lg:w-40 bottom-1 right-7 
                md:right-0 md:bottom-12 lg:right-0 
                lg:bottom-12 x1:right-0"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
            <div class="flex flex-col justify-center items-center">
              <div class='flex flex-col justify-center items-center font-bold text-2xl'>
                <h3 class="text-red-700">REASON TO CHOOSE</h3>
                <h1 class="italic">CELIA'S ACADEMY</h1>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-2 lg:grid-cols-4 p-8">
                {localData.map((item) => (
                  <div key={item.id} class="bg-white shadow-md w-fit h-fit rounded-lg p-6 mb-6 flex flex-col justify-center items-center text-center">
                    <div class='py-5'>{item.image}</div>
                    <h3 class="text-xl font-semibold mb-2">{item.title}</h3>
                    <p class="text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
          </div>
        </section>
      </div>
    </>
  )
}