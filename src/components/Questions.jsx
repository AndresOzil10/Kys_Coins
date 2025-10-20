import React from 'react';
import PageFooter from './PageFooter';

function Questions() {
  return (
    <>
      <div className="w-full max-w-3xl bg-gradient-to-br mx-auto px-4 py-8 space-y-6">
        {/* Preguntas */}
        {[
          {
            question: '¿Cuál es el objetivo del proyecto KAYSER-POINTS?',
            answer: (
              <p>
                El objetivo es fomentar la participación en el desarrollo de ideas y gratificar al personal de Kayser planta Puebla mediante KAYSER-POINTS, para las actividades relacionadas a ideas de mejora dentro de las 5 categorías, mismos que serán intercambiados por productos.
              </p>
            ),
          },
          {
            question: '¿Qué tipo de propuestas puedo dar?',
            answer: (
              <>
                <p>Cualquier propuesta que entre en cualquiera de las 5 categorías siguientes:</p>
                <ol className="list-decimal list-inside space-y-1 text-justify">
                  <li><b>Mejora de Proceso:</b> Para que una propuesta entre en esta categoría debe poder medirse con al menos uno de los siguientes indicadores clave de desempeño (KPI) y tener un resultado positivo; Mejora de productividad, Reducción de tiempo ciclo, Cumplimiento de entregas y/o Reducción de tiempo de cambio.</li>
                  <li><b>Medio Ambiente:</b> Para que una propuesta entre en esta categoría debe poder medirse al menos uno de los siguientes aspectos ambientales, y tener un resultado positivo; Residuos, Residuos peligrosos, Consumo de agua y/o Consumo de energía.</li>
                  <li><b>Calidad:</b> Para que una propuesta entre en esta categoría debe impactar por lo menos una de las clasificaciones siguientes; Eliminación de retrabajos, Eliminación de marcas de certificación, Reducción de scrap y/o Prevención de reclamos de calidad.</li>
                  <li><b>Mejoras de ergonomía y seguridad:</b> Para que una propuesta entre en esta categoría debe lograr reducir el nivel de riesgo (Rojo: Grave, Amarillo: Medio, Verde: Leve).</li>
                  <li><b>5's:</b> La categoría 5's será evaluada por auditorías internas a cada una de las áreas establecidas (Conectores, llenado, inyección, soplado, calidad, mantenimiento, EOL, extrusión, flexión, tubería) bajo el sistema de "Carrera de excelencia".</li>
                </ol>
              </>
            ),
          },
          {
            question: '¿Cuánto tarda en aprobarse mi idea y cómo se asignan los puntos?',
            answer: (
              <>
                <p>Los tiempos de evaluación de cada propuesta son dependientes de la categoría a la que se asigne, así como la asignación de puntos.</p>
                <ol className="list-decimal list-inside space-y-1 text-justify">
                  <li>Todas las propuestas serán evaluadas por alguno de los integrantes del equipo de idea manager, quienes después de realizar las tareas de evaluación de factibilidad determinarán si la propuesta es viable o no para su implementación, y en cualquiera de los casos, tendrá que compartir sus comentarios.</li>
                  <li>La asignación de puntos se pondera bajo las siguientes evaluaciones:
                    <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                      <li><b>Categoría Mejora de Proceso:</b> Ahorro anual en USD producto de mejora.</li>
                      <li><b>Medio Ambiente:</b> Residuos y residuos peligrosos: Porcentaje de reducción de consumo de residuos. Agua: Reducción de consumo en cantidad de litros. Energía: Reducción de consumo de energía en porcentaje.</li>
                      <li><b>Calidad:</b> Eliminación de retrabajos y eliminación de marcas de certificación: Ahorro anual en MXN producto de mejora. Reducción de scrap: Porcentaje de reducción de scrap de acuerdo al área productiva. Prevención de reclamos: Dependiente al tipo de reclamo prevenido (Interno, Intercompany u OEM).</li>
                      <li><b>Mejoras de ergonomía y seguridad:</b> Evaluado bajo el cambio de nivel de riesgo logrado.</li>
                      <li><b>5's:</b> Mejor resultado obtenido de las auditorías (por área).</li>
                    </ul>
                  </li>
                </ol>
              </>
            ),
          },
          {
            question: '¿Cómo puedo agregar una nueva propuesta?',
            answer: (
              <>
                <p>Deberás ingresar al portal, en la sección "Nueva Propuesta" y registrar los siguientes datos:</p>
                <ol className="list-decimal list-inside space-y-1 text-justify">
                  <li>Título de la idea: Debe ser corto y que exprese tu idea.</li>
                  <li>Descripción de la actividad: Aquí podrás extenderte más y explicar de qué se trata tu propuesta y qué esperas conseguir con ella.</li>
                  <li>Área de trabajo: El área donde desarrollarás tus actividades.</li>
                  <li>Área de implementación: El área donde pensaste la idea.</li>
                </ol>
                <p className="mt-2">
                  En caso de que tu propuesta sea en equipo, deberás colocar el nombre de cualquiera de los integrantes en el apartado de idea creator, y el de los demás en la parte de "Colaboradores". No importa quién quede como idea creator, se entiende que todos son parte del equipo.
                </p>
              </>
            ),
          },
          {
            question: '¿Cómo puedo cambiar mis puntos ganados?',
            answer: (
              <>
                <p>El departamento de RRHH será el encargado de anunciar cuando el periodo de canjeo se abra, y el proceso será el siguiente:</p>
                <ol className="list-decimal list-inside space-y-1 text-justify">
                  <li>Tendrás que ingresar al portal con tu tarjeta de acceso.</li>
                  <li>Ingresa a la sección de "Consultar mis puntos" - ahí podrás observar cuántos puntos tienes vigentes para cambiar.</li>
                  <li>Puedes ingresar al apartado de "Catálogo de premios" - ahí podrás ver el o los premios que puedes adquirir con tus puntos actuales.</li>
                  <li>Entra al apartado de "Canjear puntos" y haz tu solicitud.</li>
                  <li>Listo, espera a que tu premio llegue.</li>
                </ol>
              </>
            ),
          },
          {
            question: '¿Quiénes forman parte del idea manager?',
            answer: (
              <>
                <p className="text-justify">
                  Son aquellas personas que forman parte del equipo multidisciplinario pertenecientes a áreas correspondientes o de soporte para cada categoría. Su tarea es evaluar la factibilidad y gestionar las propuestas. Si tienes alguna duda sobre el proyecto o algún tema relacionado con tus propuestas, puedes contactarlos:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li><b>Daniel Castillo.</b> Área: Mantenimiento. Contacto: D.Castillo@kayser-automotive.com</li>
                  <li><b>Erika García.</b> Área: O7. Contacto: E.GarciaM@kayser-automotive.com</li>
                  <li><b>Liliana Nava.</b> Área: O7. Contacto: M.Nava@kayser-automotive.com</li>
                  <li><b>Carolina Galindo.</b> Área: O7. Contacto: C.Galindo@kayser-automotive.com</li>
                  <li><b>Gustavo Cruz.</b> Área: O7. Contacto: G.Cruz@kayser-automotive.com</li>
                  <li><b>Obed Padilla.</b> Área: Mantenimiento. Contacto: O.Padilla@kayser-automotive.com</li>
                  <li><b>Fernanda Gonzalez.</b> Área: O7. Contacto: F.GonzalezTellez@kayser-automotive.com</li>
                </ul>
              </>
            ),
          },
          {
            question: '¿Hay límite de propuestas por persona?',
            answer: (
              <p>No, no existe límite de propuestas por persona. "Cada idea cuenta, cada mejora suma."</p>
            ),
          },
          {
            question: '¿Qué sucede si no canjeo mis puntos?',
            answer: (
              <>
                <p>Los puntos dados por una propuesta tendrán vigencia de un año a partir de que se otorguen, son acumulables y serán canjeados por cuartal.</p>
                <p>
                  En caso de no haber canjeado tus puntos durante el año de vigencia, automáticamente serán borrados. El equipo de idea manager será responsable de notificarle a RRHH cuando una propuesta tenga nuevos puntos liberados, y RRHH notificará al personal mediante un anuncio, para que cada uno pueda entrar al portal con su usuario y pueda conocer la cantidad de puntos otorgados.
                </p>
                <p>Si quieres conocer todo acerca de tus puntos vigentes, por vencer y vencidos, puedes seguir los siguientes pasos:</p>
                <ol className="list-decimal list-inside space-y-1 text-justify">
                  <li>Entra al portal de "KAYSER-POINTS" con tu tarjeta de acceso.</li>
                  <li>En el menú podrás encontrar el apartado "Puntos Acumulados".</li>
                  <li>Ahí podrás encontrar tu total de puntos.</li>
                </ol>
              </>
            ),
          },
        ].map(({ question, answer }, idx) => (
          <section key={idx}>
            <details className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg shadow-sm">
              <summary className="collapse-title cursor-pointer text-lg font-semibold text-gray-800">
                {question}
              </summary>
              <div className="collapse-content mt-2 text-gray-700 text-justify space-y-2">
                {answer}
              </div>
            </details>
          </section>
        ))}

        {/* Eslogan */}
        <div className="text-center pt-6 border-t border-gray-300 mt-8">
          <h3 className="text-lg font-semibold text-gray-800">
            One World. One Family. One KAYSER.
          </h3>
        </div>
      </div>
      <PageFooter />
    </>
    
  )
}

export default Questions