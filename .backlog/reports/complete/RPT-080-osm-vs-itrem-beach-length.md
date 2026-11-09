---
id: RPT-080
title: OSM vs ITREM beach length: 102 beaches differ by more than 2x (TSK-147)
type: finding
severity: low
status: triaged
created: 2026-11-09
triaged: 2026-11-09
task-id: TSK-147
---

## Summary

`scripts/fetch-itrem-dimensions.ts` (TSK-147) read the official length and average width of 154 beaches from the ITREM sheets on 2026-11-09. 102 of them differ from the OSM `length` in `data/beaches.json` by more than 2x. Decision: the beach page and the recommendation score use the ITREM length when published (`getDisplayLength`), OSM stays as evidence. A first parse read "1.963 m" as 1 m (Spanish thousands separator); fixed before this list was produced.

## Score impact

135 beaches change recommendation score (length weighs 15%). Top 10 by score before: 679, 660, 562, 512, 663, 654, 671, 672, 581, 675. After: 660, 562, 512, 671, 672, 679, 675, 663, 561, 676. Largest rank moves: 560 Portmán (+39, ITREM 950 m vs OSM 210 m), 634 El Palomarico (−37), 618 La Cola (+35), 7050 Cala Canalicas (−33), 611 La Cañada del Negro (−33). Home hero and featured slots are hand-picked codes (LRN-019) and do not move.

## Beaches where OSM and ITREM length differ by more than 2x

| Code | Beach | OSM m | ITREM m | Ratio |
|---|---|---|---|---|
| 7050 | Cala Canalicas | 955 | 30 | 31.8x |
| 634 | Playa de El Palomarico | 1062 | 90 | 11.8x |
| 7052 | Playa del Saladar | 587 | 65 | 9.0x |
| 567 | Cala del Cuartel del Ciscar | 171 | 20 | 8.6x |
| 7051 | Playa del Hoyo | 326 | 40 | 8.2x |
| 657 | Playa Isla Plana | 76 | 580 | 7.6x |
| 599 | Playa El Rafal | 745 | 100 | 7.5x |
| 5907 | Playa Larga | 83 | 600 | 7.2x |
| 625 | Playa de la Higuerica | 1346 | 200 | 6.7x |
| 620 | Playa Ensenada de la Fuente | 572 | 85 | 6.7x |
| 649 | Playa de La Ermita | 672 | 100 | 6.7x |
| 548 | Playa de Calabarrilla | 200 | 30 | 6.7x |
| 607 | Playa de La Gola | 1572 | 250 | 6.3x |
| 611 | Playa de La Cañada del Negro | 943 | 150 | 6.3x |
| 630 | Cala Junquera | 237 | 40 | 5.9x |
| 594 | Playa del Pino | 539 | 100 | 5.4x |
| 623 | Playa de Las Pulgas | 318 | 60 | 5.3x |
| 682 | Playa de La Mota | 543 | 2700 | 5.0x |
| 613 | Playa de La Casica Verde | 943 | 200 | 4.7x |
| 632 | Playa Baño de las Mujeres | 187 | 40 | 4.7x |
| 677 | Playa de Los Urrutias | 3488 | 750 | 4.7x |
| 560 | Playa de Portmán | 210 | 950 | 4.5x |
| 647 | Playa de La Pava | 447 | 100 | 4.5x |
| 593 | Playa de Calacerrada | 661 | 150 | 4.4x |
| 564 | Playa de Poniente | 205 | 900 | 4.4x |
| 556 | Cala del Barco | 174 | 40 | 4.3x |
| 587 | Playa del Pozo de las Huertas | 239 | 55 | 4.3x |
| 612 | Playa de La Colonia | 2481 | 580 | 4.3x |
| 631 | Cala de San Pedro | 123 | 30 | 4.1x |
| 669 | Playa Puerto Bello | 2015 | 500 | 4.0x |
| 536 | Playa del Estacio | 723 | 2900 | 4.0x |
| 580 | Playa de La Chapineta | 1608 | 410 | 3.9x |
| 608 | Playa de Percheles | 1104 | 290 | 3.8x |
| 651 | Playa de El Alamillo | 2226 | 600 | 3.7x |
| 566 | Playa de Los Cocedores | 661 | 180 | 3.7x |
| 615 | Playa Amarilla | 543 | 150 | 3.6x |
| 602 | Cala Las Escalerillas | 162 | 45 | 3.6x |
| 543 | Playa Chica | 501 | 1800 | 3.6x |
| 646 | Playa de Bolnuevo | 451 | 1600 | 3.5x |
| 672 | Playa Pedrucho | 847 | 3000 | 3.5x |
| 552 | Cala Desnuda | 104 | 30 | 3.5x |
| 643 | Playa Cueva de Lobos | 309 | 90 | 3.4x |
| 609 | Playa La Tortuga | 206 | 60 | 3.4x |
| 605 | Cala de las Melvas | 222 | 65 | 3.4x |
| 527 | Playa del Vivero | 1847 | 550 | 3.4x |
| 533 | Playa de La Concha | 693 | 207 | 3.3x |
| 621 | Playa del Sombrerico | 326 | 100 | 3.3x |
| 617 | Playa del Arroz | 193 | 60 | 3.2x |
| 588 | Playa del Charco | 510 | 160 | 3.2x |
| 687 | Playa Cavanna | 2219 | 700 | 3.2x |
| 577 | Cala del Pino | 462 | 150 | 3.1x |
| 640 | Playa Hondón del Fondón (Playa del Jondo o del Fondo) | 301 | 100 | 3.0x |
| 692 | Playa Carrión | 931 | 310 | 3.0x |
| 565 | Playa del Pocico del Animal | 195 | 65 | 3.0x |
| 581 | Playa de El Rihuete (Playa del Rigüete) | 1179 | 400 | 2.9x |
| 644 | Playa de Piedra Mala | 334 | 115 | 2.9x |
| 696 | Playa Mistral | 723 | 250 | 2.9x |
| 579 | Cala Honda | 286 | 100 | 2.9x |
| 628 | Cala Blanca | 214 | 75 | 2.9x |
| 5906 | Playa El Siscal | 442 | 155 | 2.9x |
| 590 | Playa de Calblanque | 848 | 300 | 2.8x |
| 654 | Playa de El Mojón | 1309 | 465 | 2.8x |
| 545 | Playa de La Llana (Playa de La Barraca Quemada) | 1962 | 700 | 2.8x |
| 629 | Cala Leña | 153 | 55 | 2.8x |
| 586 | Playa Amarilla | 304 | 110 | 2.8x |
| 679 | Playa de Calarreona | 1346 | 490 | 2.7x |
| 663 | Cala de Calnegre | 521 | 190 | 2.7x |
| 624 | Playa de la Galera | 356 | 130 | 2.7x |
| 563 | Playa Las Amoladeras | 222 | 600 | 2.7x |
| 635 | Playa de las Minas | 267 | 100 | 2.7x |
| 610 | Cala de La Herradura | 106 | 40 | 2.6x |
| 535 | Playa El Pescador | 603 | 230 | 2.6x |
| 582 | Playa de la Azohía - El Cuartel | 314 | 800 | 2.5x |
| 598 | Playa del Matalentisco | 106 | 270 | 2.5x |
| 636 | Playa del Ballenato | 496 | 200 | 2.5x |
| 645 | Playa de El Rincón | 221 | 90 | 2.5x |
| 648 | Playa de La Reya (Junta de los Mares) | 974 | 400 | 2.4x |
| 683 | Playa de Nares | 970 | 400 | 2.4x |
| 530 | Playa de Islas Menores | 595 | 1400 | 2.4x |
| 539 | Playa Lebeche | 734 | 1700 | 2.3x |
| 633 | Playa Parazuelos | 2046 | 900 | 2.3x |
| 591 | Playa Galúa | 2219 | 980 | 2.3x |
| 641 | Playa del Barranco Ancho | 181 | 80 | 2.3x |
| 652 | Playa Negra | 356 | 160 | 2.2x |
| 670 | Playa del Barco Perdido (Playa Las Sirenas) | 2219 | 1000 | 2.2x |
| 604 | Playa El Castillico | 990 | 450 | 2.2x |
| 642 | Playa Cala de Leño | 219 | 100 | 2.2x |
| 529 | Playa Paraíso | 1745 | 800 | 2.2x |
| 618 | Playa de La Cola | 482 | 1050 | 2.2x |
| 4894 | Playa de las Moreras | 1086 | 500 | 2.2x |
| 561 | Playa El Arenal | 854 | 1850 | 2.2x |
| 575 | Cala Abierta | 173 | 80 | 2.2x |
| 638 | Playa Cobaticas | 2127 | 1000 | 2.1x |
| 666 | Playa El Mojón | 988 | 465 | 2.1x |
| 619 | Playa La Calabardina | 955 | 450 | 2.1x |
| 691 | Playa Manzanares | 821 | 395 | 2.1x |
| 592 | Playa Calnegre | 242 | 500 | 2.1x |
| 650 | Playa del Puerto de Mazarrón | 1030 | 500 | 2.1x |
| 600 | Playa de La Grúa | 174 | 85 | 2.0x |
| 664 | Playa de La Puntica | 1057 | 520 | 2.0x |
| 662 | Playa de Bahía | 384 | 190 | 2.0x |
| 688 | Playa Honda | 1406 | 700 | 2.0x |

## Notes

- Very large OSM values (La Llana 2.057 m, Los Nietos 4.531 m, La Torre Derribada 4.076 m) are coastline merges: one OSM way serves several beaches.
- Very small OSM values on long beaches (Isla Plana 76 m vs 580 m, Playa Larga Lorca 83 m vs 600 m, Bolnuevo 451 m vs 1.600 m) are truncated ways.
- Playa del Espejo (690) publishes a width range, 20-35 m, kept as bounds.
