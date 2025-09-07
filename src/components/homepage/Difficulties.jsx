import React from 'react'
import DifficultyCard from '../cards/DifficultyCard'
import { DIFFICULTIES_ITEMS } from "../../constants/difficulties";

const Difficulties = () => {
  return (
    <div>
      <section className="py-20 px-6 md:px-16 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            La gestion locative, un casse-tête pour beaucoup
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-center">
          {DIFFICULTIES_ITEMS.map(({ id, title, text, Icon: IconCmp }) => {
              const titleNode = (
                <span className="inline-flex items-center gap-3"> 
                  <IconCmp size={20} className="text-primary shrink-0" aria-hidden="true" />
                  <span>{title}</span>
              </span>
              );

              return (
                <DifficultyCard
                  key={id}
                  title={titleNode}          
                  icon={null}                
                  className="hover:shadow transition-shadow"
                >
                  {text}
                </DifficultyCard>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Difficulties