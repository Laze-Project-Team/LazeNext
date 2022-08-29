import fs from 'fs';
import path from 'path';

import { COMPETITION_DIR } from '@/const/dir';
import { fs as fsSource } from '@/features/compiler/source/fs';
import { fs2DNoTexture as fs2DNoTextureSource } from '@/features/compiler/source/fs2DNoTexture';
import { fs2DTexture as fs2DTextureSource } from '@/features/compiler/source/fs2DTexture';
import { lightFs as lightFsSource } from '@/features/compiler/source/lightFs';
import { pointFs as pointFsSource } from '@/features/compiler/source/pointFs';
import { pointVs as pointVsSource } from '@/features/compiler/source/pointVs';
import { vs as vsSource } from '@/features/compiler/source/vs';
import { vs2DNoTexture as vs2DNoTextureSource } from '@/features/compiler/source/vs2DNoTexture';
import { vs2DTexture as vs2DTextureSource } from '@/features/compiler/source/vs2DTexture';
import type {
  Competition,
  CompetitionByLevel,
  CompetitionJson,
  Competitor,
  CompetitorInfoJson,
} from '@/typings/compete';

import { getProps } from '../compiler/initialize/getProps';
import { initShaderProgram } from '../compiler/initialize/initShaderProgram';

export const getAllCompetitions = async (): Promise<string[]> => {
  const competitions = await fs.promises.readdir(COMPETITION_DIR);
  return competitions.filter((value) => {
    return value !== '.gitignore';
  });
};

//Get leaderboard list
const getLeaderboardList = async (
  levels: string[] | undefined,
  competitionPath: string
): Promise<CompetitionByLevel[]> => {
  //Get leaderboard for each level
  const levelsData: (CompetitionByLevel | null)[] = await Promise.all(
    (levels ?? []).map(async (level) => {
      const levelPath = path.join(competitionPath, level);
      // Check if the level exists
      if (fs.existsSync(levelPath)) {
        const competitorNames = await fs.promises.readdir(levelPath);
        const competitors: Competitor[] = await Promise.all(
          competitorNames.map(async (name) => {
            const competitorPath = path.join(levelPath, name);
            const infoBuffer = await fs.promises.readFile(path.join(competitorPath, 'info.json'));
            const infoJson: CompetitorInfoJson = JSON.parse(infoBuffer.toString());
            const competitor: Competitor = {
              id: name,
              ranking: 0,
              rankingData: infoJson.time,
              wasmUrl: path.join(levelPath, name, 'main.wasm'),
              programUrl: path.join(levelPath, name, 'main.laze'),
            };
            return competitor;
          })
        );
        const levelData: CompetitionByLevel = {
          level: level,
          players: competitors,
        };
        return levelData;
      } else {
        return null;
      }
    })
  );
  const finalLevelsData: CompetitionByLevel[] = levelsData.filter((value) => {
    return value != null;
  }) as CompetitionByLevel[];
  return finalLevelsData;
};

export const getCompetitionData = async (id: string): Promise<Competition | null> => {
  const competitionPath = path.join(COMPETITION_DIR, id);
  const jsonPath = path.join(competitionPath, id + '.json');
  if (fs.existsSync(jsonPath)) {
    const competitionJsonStr = await fs.promises.readFile(jsonPath);
    const competitionJson: CompetitionJson = JSON.parse(
      competitionJsonStr.toString() ?? JSON.stringify({ id: '', name: '' })
    );
    const leaderboardList = await getLeaderboardList(competitionJson.levels, competitionPath);

    const competition: Competition = {
      ...competitionJson,
      leaderboardList: leaderboardList,
    };
    return competition;
  } else {
    return null;
  }
};

export const executeWasm = async (wasm: ArrayBuffer): Promise<boolean> => {
  try {
    if (window.laze.props) {
      window.laze.props = getProps(window.laze?.props?.variables?.interval);
    } else {
      window.laze.props = getProps(null);
    }
    const { canvas, gl, importObject, variables } = window.laze.props;

    window.laze.props.webglObjects = {
      webglBuffers: [],
      webglPrograms: [],
      webglTextures: [],
      webglUniformLoc: [],
    };
    const executable = await WebAssembly.instantiate(wasm, importObject(variables.id));
    if (variables.interval) {
      clearInterval(variables.interval);
    }
    const { instance } = executable;
    window.laze.props.webglObjects.webglPrograms.push(
      initShaderProgram(gl, vsSource, fsSource),
      initShaderProgram(gl, vsSource, lightFsSource),
      initShaderProgram(gl, pointVsSource, pointFsSource),
      initShaderProgram(gl, vs2DTextureSource, fs2DTextureSource),
      initShaderProgram(gl, vs2DNoTextureSource, fs2DNoTextureSource)
    );

    const memorySizeFunc = instance.exports.memorySize as CallableFunction;
    const mainFunc = instance.exports.main as CallableFunction;
    const loopFunc = instance.exports.loop as CallableFunction;
    const stringLiterals = instance.exports.__stringLiterals as CallableFunction;
    const clearMemory = instance.exports.clearMemory as CallableFunction;

    if (instance.exports.jsCallListenerNoParam) {
      window.laze.props.variables.lazeCallNoParam = instance.exports.jsCallListenerNoParam as CallableFunction | null;
    }

    clearMemory();
    stringLiterals();

    window.laze.props.variables.memorySize = memorySizeFunc();
    mainFunc();

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      loopFunc();
    };

    if (instance.exports.loop) {
      variables.interval = setInterval(draw, 1000 / 60);
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
