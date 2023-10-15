import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { readFile, writeFile, writeFileSync, copyFile } from 'fs';
import {
  OG_PETS,
  REG_NAME_PET_BURNER_TIERS_1,
  REG_NAME_PET_BURNER_TIERS_2,
  REG_NAME_PET_BURNER_TIERS_3,
  REG_NAME_PET_CELESTIAL_TIERS_1,
  REG_NAME_PET_CELESTIAL_TIERS_2,
  REG_NAME_PET_CELESTIAL_TIERS_3,
  REG_NAME_PET_CYBER_TIERS_1,
  REG_NAME_PET_CYBER_TIERS_2,
  REG_NAME_PET_CYBER_TIERS_3,
  REG_NAME_PET_GOLDBOI_TIERS_1,
  REG_NAME_PET_GOLDBOI_TIERS_2,
  REG_NAME_PET_GOLDBOI_TIERS_3,
  REG_NAME_PET_MATRIX_TIERS_1,
  REG_NAME_PET_MATRIX_TIERS_2,
  REG_NAME_PET_MATRIX_TIERS_3,
  REG_NAME_PET_ROBOTER_TIERS_1,
  REG_NAME_PET_ROBOTER_TIERS_2,
  REG_NAME_PET_ROBOTER_TIERS_3,
  REG_NAME_PET_ROUGH_TIERS_1,
  REG_NAME_PET_ROUGH_TIERS_2,
  REG_NAME_PET_ROUGH_TIERS_3,
  SPECIFIC_NAME_PET_COUNCIL,
  SPECIFIC_NAME_PET_GUARDIAN,
  SPECIFIC_NAME_PET_HONORARY,
  SPECIFIC_NAME_PET_JUDGE,
  SPECIFIC_NAME_PET_WHALE,
} from '@src/enum/og-pet-draw';
import { MintService } from '@src/mint/mint.service';
import {
  CODE_DRONE_BURNER,
  CODE_DRONE_CELESTIAL,
  CODE_DRONE_CYBER,
  CODE_DRONE_GOLDBOI,
  CODE_DRONE_MATRIX_ANGEL,
  CODE_DRONE_ROBOTER,
  CODE_DRONE_ROUGH,
  HEALING_DRONE,
  SUPPLY_HEALING_DRONE,
} from '@src/enum/healing-drone-draw';

// npm run command-nest metadata-healing-drone
@Command({
  name: 'metadata-healing-drone',
  description: 'Build metadata and media files',
})
@Injectable()
export class HealingDroneService extends CommandRunner {
  private static readonly logger = new Logger(HealingDroneService.name);
  constructor(private mintService: MintService) {
    super();
  }

  async run() {
    HealingDroneService.logger.log('[Command] HealingDroneService');
    // BUILD csv list
    this.buildList();

    // CHECK SUPPLY on csv file
    // this.checkSupply();

    // COPY and FILL Directory with media to fill pinata
    // this.fillMedia();

    // REQUIRED: send media content on pinata and fill CID Ipfs to build metadata
    //this.fillMetadata();
  }

  fillMetadata() {
    readFile('list-og-pets.csv', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const result = data.split('\n');
        let id = 1;
        result.forEach((name) => {
          const data = this.mintService.generateMetadata(id, name);
          writeFileSync(`./data/metadata/${id}`, JSON.stringify(data, null, 2));
          console.log(id, name);
          id++;
        });
      }
    });
  }

  fillMedia() {
    readFile('list-og-pets.csv', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const result = data.split('\n');
        let tokenIndexCurrent = 1;
        result.forEach((name) => {
          const draw = OG_PETS[name];
          copyFile(
            `./data/og-pets/origin/gifs/${draw.gif}`,
            `./data/gif/${tokenIndexCurrent}.gif`,
            (err) => {
              if (err) {
                console.log('Error Found:', err);
              } else {
                console.log(
                  `\nGIF of copied_file: ${tokenIndexCurrent} - ${draw.pet}`,
                );
              }
            },
          );
          copyFile(
            `./data/og-pets/origin/video/${draw.video}`,
            `./data/video/${tokenIndexCurrent}.mp4`,
            (err) => {
              if (err) {
                console.log('Error Found:', err);
              } else {
                console.log(
                  `\nVIDEO of copied_file: ${tokenIndexCurrent} - ${draw.pet}`,
                );
              }
            },
          );
          tokenIndexCurrent++;
        });
      }
    });
  }

  checkSupply() {
    readFile('list-og-pets.csv', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const countSupply = {
          [REG_NAME_PET_ROUGH_TIERS_1]: 0,
          [REG_NAME_PET_ROUGH_TIERS_2]: 0,
          [REG_NAME_PET_ROUGH_TIERS_3]: 0,
          [REG_NAME_PET_CYBER_TIERS_1]: 0,
          [REG_NAME_PET_CYBER_TIERS_2]: 0,
          [REG_NAME_PET_CYBER_TIERS_3]: 0,
          [REG_NAME_PET_MATRIX_TIERS_1]: 0,
          [REG_NAME_PET_MATRIX_TIERS_2]: 0,
          [REG_NAME_PET_MATRIX_TIERS_3]: 0,
          [REG_NAME_PET_GOLDBOI_TIERS_1]: 0,
          [REG_NAME_PET_GOLDBOI_TIERS_2]: 0,
          [REG_NAME_PET_GOLDBOI_TIERS_3]: 0,
          [REG_NAME_PET_ROBOTER_TIERS_1]: 0,
          [REG_NAME_PET_ROBOTER_TIERS_2]: 0,
          [REG_NAME_PET_ROBOTER_TIERS_3]: 0,
          [REG_NAME_PET_BURNER_TIERS_1]: 0,
          [REG_NAME_PET_BURNER_TIERS_2]: 0,
          [REG_NAME_PET_BURNER_TIERS_3]: 0,
          [REG_NAME_PET_CELESTIAL_TIERS_1]: 0,
          [REG_NAME_PET_CELESTIAL_TIERS_2]: 0,
          [REG_NAME_PET_CELESTIAL_TIERS_3]: 0,
          [SPECIFIC_NAME_PET_COUNCIL]: 0,
          [SPECIFIC_NAME_PET_HONORARY]: 0,
          [SPECIFIC_NAME_PET_GUARDIAN]: 0,
          [SPECIFIC_NAME_PET_JUDGE]: 0,
          [SPECIFIC_NAME_PET_WHALE]: 0,
        };
        const result = data.split('\n');
        result.forEach((pet) => {
          countSupply[pet]++;
        });

        console.log(countSupply);
      }
    });
  }

  buildList() {
    const result = [];

    const countSupply = {
      [CODE_DRONE_CELESTIAL]: 0,
      [CODE_DRONE_BURNER]: 0,
      [CODE_DRONE_ROBOTER]: 0,
      [CODE_DRONE_GOLDBOI]: 0,
      [CODE_DRONE_MATRIX_ANGEL]: 0,
      [CODE_DRONE_CYBER]: 0,
      [CODE_DRONE_ROUGH]: 0,
    };

    for (let i = 1; i <= SUPPLY_HEALING_DRONE; i++) {
      const prize = this.suffle(HEALING_DRONE, countSupply);
      if (prize == null) {
        i--;
        continue;
      }
      countSupply[prize.code]++;
      result.push(prize.code);
      console.log(i, prize.code);
    }

    let sum = 0;
    Object.keys(countSupply).forEach((key) => {
      sum += countSupply[key];
    });

    writeFile(`./healing-drone.csv`, result.join('\n'), (err) => {
      if (err) {
        console.log('Error Found:', err);
      } else {
        console.log(`\nList ok ${sum}`);
      }
    });
  }

  generateFile(index, draw) {
    const data = this.mintService.generateMetadata(index, draw.pet);
    writeFileSync(
      `./data/metadata/${index}.json`,
      JSON.stringify(data, null, 2),
    );
    copyFile(
      `./data/og-pets/origin/gifs/${draw.gif}`,
      `./data/gif/${index}.gif`,
      (err) => {
        if (err) {
          console.log('Error Found:', err);
        } else {
          console.log('\nGIF of copied_file: ' + draw.pet);
        }
      },
    );
    copyFile(
      `./data/og-pets/origin/video/${draw.video}`,
      `./data/video/${index}.mp4`,
      (err) => {
        if (err) {
          console.log('Error Found:', err);
        } else {
          console.log('\nVIDEO of copied_file: ' + draw.pet);
        }
      },
    );
  }

  suffle(rafflePrize, result) {
    // Vérifier si le tableau est vide
    if (rafflePrize.length === 0) {
      console.log('Raffle prize emtpy');
      return null;
    }

    // Calculer le total des pourcentages de chance
    let totalChances = 0;
    rafflePrize.forEach((lot) => {
      totalChances += lot.percent;
    });

    const random = Math.random() * totalChances;

    let lucky = 0;
    for (let i = 0; i < rafflePrize.length; i++) {
      const lot = rafflePrize[i];

      if (result[lot.pet] == lot.supply) {
        continue;
      }

      lucky += lot.percent;

      if (random < lucky) {
        return lot;
      }
    }

    return null;
  }
}
