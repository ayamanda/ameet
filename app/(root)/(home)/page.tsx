import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const dateTime = new Date(now);

  const time = dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' })).format(dateTime);

  let greeting = '';
  const hour = dateTime.getHours();
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening';
  } else {
    greeting = 'Good night';
  }

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {greeting} 😊
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;