export const linetraceTemplate: Record<string, string> = {
  Easy: `関数: 実行() => (){
	マウスキャプチャ();
	ライントレースシミュレーション: ロボット("Easy");
	ロボット.左モーターON = 1;
	ロボット.右モーターON = 1;
	ロボット.左モーター向き = 1; 
	ロボット.右モーター向き = 1;
	ロボット.左モーター速度 = 3.0;
	ロボット.右モーター速度 = 3.0;
	無限ループ{
		// ここにライントレースのコードを書こう
		もし(ロボット.右センサー値 > 130 && ロボット.左センサー値 > 130)ならば{
				ロボット.左モーターON = 1;
				ロボット.右モーターON = 1;
		}
		でなければ、もし(ロボット.右センサー値 > 130 && ロボット.左センサー値 < 130)ならば{
				ロボット.左モーターON = 0;
				ロボット.右モーターON = 1;
		}
		でなければ、もし(ロボット.右センサー値 < 130 && ロボット.左センサー値 > 130)ならば{
				ロボット.左モーターON = 1;
				ロボット.右モーターON = 0;
		}
		でなければ、もし(ロボット.右センサー値 < 130 && ロボット.左センサー値 < 130)ならば{
				ロボット.左モーターON = 0;
				ロボット.右モーターON = 0;
		}
		
		ロボット.アップデート();
	}
}
`,
  Medium: `関数: 実行() => (){
	マウスキャプチャ();
	ライントレースシミュレーション: ロボット("Medium");
	ロボット.左モーターON = 1;
	ロボット.右モーターON = 1;
	ロボット.左モーター向き = 1;
	ロボット.右モーター向き = 1;
	ロボット.左モーター速度 = 3.0;
	ロボット.右モーター速度 = 3.0;
	無限ループ{
		// ここにライントレースのコードを書こう
		
		ロボット.アップデート();
	}
}
`,
  Hard: `関数: 実行() => (){
	マウスキャプチャ();
	ライントレースシミュレーション: ロボット("Hard");
	ロボット.左モーターON = 1;
	ロボット.右モーターON = 1;
	ロボット.左モーター向き = 1;
	ロボット.右モーター向き = 1;
	ロボット.左モーター速度 = 3.0;
	ロボット.右モーター速度 = 3.0;
	無限ループ{
		// ここにライントレースのコードを書こう
		
		ロボット.アップデート();
	}
}
`,
};
