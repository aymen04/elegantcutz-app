import { useState } from 'react';

interface AnimatedTeamCardProps {
  barber: {
    id: string;
    name: string;
    role: string;
    image: string;
    rating: number;
    reviews: number;
    specialties: string[];
  };
  onSelectBarber: (barber: any) => void;
}

export function AnimatedTeamCard({ barber, onSelectBarber }: AnimatedTeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`
        animated-card
        h-48 w-full max-w-lg mx-auto mb-6 
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-zinc-900/90 to-zinc-800/90
        cursor-pointer transition-all duration-500 ease-out
        ${isHovered ? 'transform -translate-y-2 shadow-2xl shadow-amber-500/20' : ''}
        border border-zinc-700/50 hover:border-amber-500/50
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectBarber(barber)}
    >
      {/* Back Text */}
      <span className={`
        absolute right-4 bottom-14 z-10
        text-4xl font-bold text-zinc-400
        transition-all duration-300
        ${isHovered ? 'text-amber-500 scale-110' : ''}
      `}>
        {barber.name}
      </span>

      {/* Background Gradient Layers */}
      <div className="cards_slide_inner_left absolute inset-0 bg-gradient-to-r from-blue-900/30 to-blue-700/30 transform -skew-y-3 origin-bottom-left" />
      <div className="cards_slide_inner_right absolute inset-0 bg-gradient-to-r from-amber-600/40 to-amber-800/40 transform skew-y-3 origin-top-right" />
      
      {/* Main Sliding Panel */}
      <div className={`
        cards_slide_left absolute left-0 top-0 h-full
        bg-gradient-to-r from-zinc-700 to-zinc-600
        transform -skew-y-6 origin-top-left
        border-r-4 border-amber-500/60
        flex items-center justify-center
        transition-all duration-700 ease-out
        ${isHovered ? 'w-2/3' : 'w-full'}
      `}>
        <div className="slide_left_window absolute left-6 h-5/6 w-3/5 bg-gradient-to-br from-zinc-800 to-zinc-900 transform skew-x-12 rounded-2xl overflow-hidden border border-zinc-600/50">
          {/* Employee Photo */}
          <img 
            src={barber.image} 
            alt={barber.name}
            className="w-full h-full object-cover object-top"
          />
          
          {/* Barber Info Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/40 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg mb-1">{barber.name}</h3>
            <p className="text-amber-400 text-sm mb-2">{barber.role}</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-amber-500">★</span>
                <span className="text-white text-sm">{barber.rating}</span>
                <span className="text-zinc-400 text-xs">({barber.reviews})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {barber.specialties.slice(0, 2).map((specialty) => (
                <span key={specialty} className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full border border-amber-500/30">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={`
        cards_slide_right absolute right-0 top-0 h-full
        bg-gradient-to-r from-amber-600 to-zinc-900
        transform -skew-y-6 origin-top-right
        transition-all duration-700 ease-out
        ${isHovered ? 'w-16' : 'w-32'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent" />
      </div>

      {/* Hover Effect Overlay */}
      <div className={`
        absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent
        transition-opacity duration-500 pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />

      {/* Action Button */}
      <div className={`
        absolute bottom-4 left-4 right-4
        transition-all duration-500
        ${isHovered ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0'}
      `}>
        <button className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-2 px-4 rounded-full transition-colors duration-300">
          Réserver avec {barber.name}
        </button>
      </div>

      {/* Special Badge for Owner */}
      {barber.id === '1' && (
        <div className="absolute top-4 left-4 bg-amber-500 text-zinc-950 px-3 py-1 rounded-full text-sm font-semibold">
          Propriétaire
        </div>
      )}
    </div>
  );
}
