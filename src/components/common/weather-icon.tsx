import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  HelpCircle 
} from 'lucide-react';
import { getWeatherCondition } from '@/lib/constants/weather';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  weatherCode: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showEmoji?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const emojiSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl'
};

function getIconComponent(iconName: string) {
  const iconMap = {
    'sun': Sun,
    'cloud': Cloud,
    'cloud-rain': CloudRain,
    'cloud-snow': CloudSnow,
    'cloud-lightning': CloudLightning,
    'cloud-drizzle': CloudDrizzle,
    'cloud-fog': Cloud,
    'help-circle': HelpCircle
  };
  
  return iconMap[iconName as keyof typeof iconMap] || HelpCircle;
}

export function WeatherIcon({ 
  weatherCode, 
  size = 'md', 
  showEmoji = false,
  className 
}: WeatherIconProps) {
  const condition = getWeatherCondition(weatherCode);
  
  if (showEmoji) {
    return (
      <span 
        className={cn(emojiSizeClasses[size], className)}
        role="img"
        aria-label={condition.description}
      >
        {condition.emoji}
      </span>
    );
  }
  
  const IconComponent = getIconComponent(condition.icon);
  
  return (
    <IconComponent 
      className={cn(sizeClasses[size], className)}
      aria-label={condition.description}
    />
  );
} 