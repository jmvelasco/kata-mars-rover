# 🛸 Mars Rover Kata

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3-black.svg)](https://bun.sh/)
[![ESLint](https://img.shields.io/badge/ESLint-9.32-4B32C3.svg)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.6-F7B93E.svg)](https://prettier.io/)
[![Jest](https://img.shields.io/badge/Jest-30.0-C21325.svg)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Proyecto para la resolución de la **Kata Mars Rover** en TypeScript utilizando Bun, Jest, ESLint y Prettier.

---

## 🎯 Enunciado de la Kata

Estás desarrollando la API para controlar un vehículo explorador (rover) en la superficie de Marte.

### Requisitos:

1. **Posición e Inicialización**:
   - El rover se coloca en una cuadrícula (grid) en una posición inicial representada por las coordenadas `(x, y)` y una orientación (`N`, `E`, `S`, `W`).
   - Ejemplo de posición inicial: `(0, 0, 'N')`.

2. **Procesamiento de Comandos**:
   - El rover acepta una cadena o lista de comandos y los ejecuta en secuencia:
     - `L`: Gira 90 grados a la izquierda (sin cambiar de casilla).
     - `R`: Gira 90 grados a la derecha (sin cambiar de casilla).
     - `M` (o `F`): Avanza una posición hacia adelante en la dirección actual.
     - `B`: Retrocede una posición en la dirección opuesta.
   - **Persistencia de Estado**: El rover **mantiene su posición y orientación actual**. Al enviar un nuevo comando o secuencia, el movimiento parte de donde quedó el rover tras la ejecución anterior (no regresa al origen).

3. **Malla Esférica (Wrapping)**:
   - Dado que la superficie planetaria se conecta en los bordes de la cuadrícula, si el rover se desplaza más allá del límite del mapa, debe reaparecer en el extremo opuesto (grid wrapping).

4. **Detección de Obstáculos**:
   - El mapa puede contener obstáculos en coordenadas fijas `(x, y)`.
   - Si el rover encuentra un obstáculo durante la secuencia de movimientos:
     - Debe abortar el resto de los comandos.
     - Se detiene en la última posición válida anterior al obstáculo.
     - Reporta la presencia del obstáculo encontrado.

---

## 🚀 Inicio Rápido

### Prerrequisitos

- [Bun](https://bun.sh/) >= 1.0.0

### Instalación

```bash
# Clonar este repositorio
git clone https://github.com/jmvelasco/kata-mars-rover.git
cd kata-mars-rover

# Instalar dependencias
bun install

# Ejecutar los tests
bun test
```

---

## 📋 Comandos Disponibles

### Desarrollo y Formato

```bash
bun dev              # Modo watch para compilación TypeScript
bun run lint         # Ejecutar ESLint
bun run lint:fix     # Corregir errores de ESLint automáticamente
bun run format       # Comprobar el formato con Prettier
bun run format:fix   # Aplicar formato de Prettier
```

### Testing

```bash
bun test             # Ejecutar suite de tests con Jest
bun run test:watch   # Ejecutar tests en modo watch
bun run test:coverage # Generar reporte de cobertura
```

### Validación de Calidad

```bash
bun run validate     # Validación completa (compilar + lint + test)
```

---

## 🙏 Reconocimientos

Basado en la plantilla inicial de TypeScript de [Software Crafters](https://softwarecrafters.io).
