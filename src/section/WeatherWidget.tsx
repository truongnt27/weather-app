import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { dayNames } from '@/lib/constants';
import { fetchWeatherData } from '@/service/weather';
import { WeatherData } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const WeatherWidget = ({ city, lat, lon, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: city,
  });
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      if (lat && lon) {
        const data = await fetchWeatherData(lat, lon);
        setWeatherData(data);
      }
    };
    loadWeather();
    const interval = setInterval(loadWeather, 600000); // refresh every 10 min
    return () => clearInterval(interval);
  }, [city]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-80 cursor-move min-h-[430px]"
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg capitalize font-semibold">{city}</h2>
            {weatherData ? weatherData.current.temperature_2m : '--'}°C
          </div>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {weatherData ? (
          <>
            <div className="text-xs">Hourly Forecast</div>
            <ScrollArea className="mt-2 w-full pb-2">
              <div className="flex gap-2 text-sm">
                {weatherData.hourly.time.slice(0, 24).map((t, i) => (
                  <div key={t}>
                    <div className="">{new Date(t).getHours()}:00</div>
                    <div>{weatherData.hourly.temperature_2m[i]}°</div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="mt-4 text-xs">Next 5 Days Forecast</div>
            <div className="text-sm mt-2">
              {weatherData.daily.temperature_2m_max.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-row justify-between border-t border-gray-200 py-2"
                >
                  <div>
                    {dayNames[new Date(weatherData.daily.time[i]).getDay()]}
                  </div>
                  <div>
                    {weatherData.daily.temperature_2m_min[i]}° -{' '}
                    {weatherData.daily.temperature_2m_max[i]}°
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
