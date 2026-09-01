# Resumen de Exploración y Propuesta: Mars Rover Kata

Este documento resume el proceso de reflexión (`opsx-explore`) que nos llevó a la arquitectura final para implementar la Kata del Mars Rover.

## 1. Identificación del Dominio (Domain Modeling)

Durante la exploración inicial, desglosamos los conceptos principales:
- **El Vehículo (Rover)**: Tiene una posición `(x, y)` y una orientación (`N, E, S, W`).
- **El Planeta (Grid / Plateau)**: Define los límites del terreno para poder aplicar la física espacial (malla esférica o *wrapping*) y contiene las coordenadas de los obstáculos.
- **Comandos**: Instrucciones de giro (`L`, `R`) y movimiento (`M`/`F`, `B`).

## 2. Opciones Arquitectónicas Exploradas

Planteamos tres enfoques fundamentales para distribuir las responsabilidades:

### A. Orientado a Objetos Clásico (El Rover Inteligente)
El `Rover` es la entidad principal que recibe los comandos. Interactúa con el mapa pasándole su vector de movimiento, y el mapa le responde si hay colisión o le da la coordenada con el *wrapping* aplicado.
* **Pro**: Intuitivo y fuertemente encapsulado (Tell, Don't Ask).
* **Contra**: Mayor acoplamiento estructural entre el Rover y el Grid.

### B. El Mapa como Orquestador (El Rover Tonto)
El `Grid` recibe los comandos y manipula al `Rover`. El Rover es solo un contenedor de su posición y dirección.
* **Pro**: Separa la física del entorno del estado local del vehículo.
* **Contra**: Riesgo de modelo anémico para el Rover.

### C. Enfoque Funcional Puro (Reducer)
Una función pura `executeCommand(state, map, cmd)` que toma un estado inmutable y devuelve el nuevo estado y el resultado de la ejecución.
* **Pro**: 100% testable, libre de efectos secundarios.
* **Contra**: Se aleja del paradigma tradicional orientado a objetos.

## 3. Decisiones Tomadas

Decidimos avanzar con el enfoque **Orientado a Objetos Clásico**, aplicando patrones de diseño sólidos para evitar "Code Smells" (como sentencias `switch` gigantes). 

Las decisiones técnicas clave fueron:

1. **Patrón State para la Dirección**: 
   En lugar de verificar mediante un `if` o `switch` a dónde mira el Rover para avanzar o girar, modelamos cada punto cardinal (`North`, `East`, `South`, `West`) como un objeto que implementa una interfaz `Direction`. Si el Rover mira al Norte y gira a la derecha, el objeto `North` devuelve una nueva instancia de `East`.
   
2. **Value Object para la Posición**:
   Las coordenadas se encapsulan en una clase inmutable `Position`. Esto facilita el diseño y los tests al disponer de un método `pos.equals(otherPos)`.

3. **El Grid gestiona la física planetaria**:
   El Rover no calcula el *wrapping* ni sabe si hay un obstáculo en sus propias tripas. Le pasa el vector de movimiento deseado al `Grid`, y es el Grid quien hace el cálculo matemático del módulo y comprueba colisiones.

4. **Matemáticas Seguras para el Wrapping**:
   Se definió que el `Grid` debe usar una fórmula matemática segura en lugar del operador estándar `%` de JS, dado que en JS los números negativos no hacen un módulo circular perfecto (`((val % max) + max) % max`).

## 4. Formalización (OpenSpec)

Tras definir el modelo, se procedió a redactar formalmente la propuesta a través del sistema OpenSpec (`/opsx-propose`), creando el cambio `kata-oop-solution` con los siguientes artefactos:

- `proposal.md`: El "Por qué" y "Qué" del cambio.
- `specs/mars-rover/spec.md`: El contrato de comportamiento usando requerimientos y escenarios observables.
- `design.md`: Documento de diseño técnico detallando la arquitectura OOP.
- `tasks.md`: El plan de implementación paso a paso siguiendo la metodología XP y TDD.
