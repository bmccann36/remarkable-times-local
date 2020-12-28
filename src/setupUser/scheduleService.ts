import createPlist from './createPlist';
import createSchedTasks from './createSchtask';

const platform = process.platform;

const scheduleService = async function (): Promise<void> {
  switch (platform) {
    case 'win32':
      console.log('detected windows environment');
      await createSchedTasks();
      break;
    case 'darwin':
      console.log('detected mac environment');
      createPlist();
      break;
    default:
      console.error(
        'could not set up a background job to deliver newsletters because platform ' +
          platform +
          ' is not supported. Supported platforms are windows and mac'
      );
  }
};

export default scheduleService;
