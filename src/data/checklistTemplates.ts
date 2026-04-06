import { StandChecklist } from "@/types/stand";

function makeItems(labels: string[]) {
  return labels.map((label, i) => ({
    id: `item_${i}`,
    label,
    checked: false,
  }));
}

export function getDefaultChecklist(): StandChecklist {
  return {
    eletrica: makeItems([
      "Passagem de cabos",
      "Instalacao de tomadas",
      "Instalacao de iluminacao",
      "Quadro eletrico",
      "Teste de carga",
      "Aterramento",
    ]),
    marcenaria: makeItems([
      "Montagem da estrutura",
      "Paineis e divisorias",
      "Balcoes e vitrines",
      "Prateleiras",
      "Acabamento e pintura",
      "Instalacao de portas",
    ]),
    tapecaria: makeItems([
      "Forramento de paredes",
      "Forramento de balcoes",
      "Carpete / piso",
      "Cortinas e tecidos",
      "Acabamento final",
    ]),
    comunicacaoVisual: makeItems([
      "Testeira / fachada",
      "Adesivos e plotagens",
      "Banners e paineis",
      "Sinalizacao interna",
      "Totem / display",
      "Iluminacao decorativa",
    ]),
  };
}
