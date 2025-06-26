import { Heart, ExternalLink, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 F1天気予報. Made with{' '}
              <Heart className="inline h-4 w-4 text-red-500 fill-current" />
              {' '}for F1 fans.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Formula 1の各レース開催地の天気予報をお届けします
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://x.com/chanMAX_35"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-red-600 transition-colors"
            >
              <Twitter className="h-4 w-4" />
              <span className="font-medium">製作者</span>
            </a>
            <a 
              href="https://open-meteo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-red-600 transition-colors"
            >
              <span>Open-Meteo API</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">データ更新:</span>
              <span className="text-xs font-medium text-red-600">リアルタイム</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-red-100 dark:border-red-900/30">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              天気データは予報であり、実際の天候と異なる場合があります。レース観戦の際は公式情報も併せてご確認ください。
            </p>
            <p className="text-xs text-muted-foreground">
              Open-Meteo APIの制約により、天気予報は最大16日先までのデータとなります。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 