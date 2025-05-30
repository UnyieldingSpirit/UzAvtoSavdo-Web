import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface Region {
  id: string;
  name: string;
}

interface RegionSelectorProps {
  regions: Region[];
  selectedRegion: string | null;
  setSelectedRegion: (id: string) => void;
  t: (key: string) => string;
}

export const RegionSelector = ({ regions, selectedRegion, setSelectedRegion, t }: RegionSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRegions = regions.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sticky top-[80px] z-20">
      <div className="container-fluid py-4">
        <div className="max-w-2xl mx-auto">
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button 
                  className={clsx(
                    "w-full p-4 rounded-xl",
                    "bg-white shadow-sm",
                    "border-2 transition-all duration-300 outline-none focus:outline-none",
                    selectedRegion ? "border-primary" : "border-gray-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      "bg-primary/5 transition-colors",
                      selectedRegion ? "text-primary" : "text-gray-400"
                    )}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-grow text-left">
                      <span className={clsx(
                        "block text-sm",
                        selectedRegion ? "text-primary" : "text-gray-400"
                      )}>
                        {selectedRegion ? t('catalog.region.selected') : t('catalog.region.choose')}
                      </span>
                      <span className={clsx(
                        "block text-base font-medium transition-colors",
                        selectedRegion ? "text-gray-900" : "text-gray-500"
                      )}>
                        {regions.find(r => r.id === selectedRegion)?.name || t('catalog.region.allRegions')}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>
                </Menu.Button>

                <AnimatePresence>
                  {open && (
                    <Menu.Items
                      as={motion.div}
                      static
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute z-1 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 focus:outline-none"
                    >
                      <div className="p-3">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('catalog.region.search')}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-gray-200"
                          />
                        </div>
                        
                        <div className="max-h-[320px] overflow-auto custom-scrollbar">
                          {filteredRegions.map((region) => (
                            <Menu.Item key={region.id}>
                              {({ active }) => (
                                <button
                                  onClick={() => setSelectedRegion(region.id)}
                                  className={clsx(
                                    "w-full px-3 py-2 rounded-lg",
                                    "flex items-center gap-3",
                                    "transition-colors duration-200 focus:outline-none",
                                    active ? "bg-gray-50" : "bg-white",
                                    selectedRegion === region.id && "bg-primary/5"
                                  )}
                                >
                                  <MapPin className={clsx(
                                    "w-4 h-4",
                                    selectedRegion === region.id ? "text-primary" : "text-gray-400"
                                  )} />
                                  <span className={clsx(
                                    "text-sm",
                                    selectedRegion === region.id ? "text-primary font-medium" : "text-gray-700"
                                  )}>
                                    {region.name}
                                  </span>
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </div>
                    </Menu.Items>
                  )}
                </AnimatePresence>
              </>
            )}
          </Menu>
        </div>
      </div>
      
      {/* Добавим глобальные стили для удаления контуров фокуса */}
      <style jsx global>{`
        button:focus, 
        [role="button"]:focus, 
        [role="menu"]:focus, 
        [role="listbox"]:focus,
        [role="option"]:focus {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};