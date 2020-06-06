const appName = process.env.REACT_APP_NAME



module.exports = {

  'translation': {

    'menuAboutButton': 'Sur',

    'menuCheckpointButton': 'Point de contrôle',

    'menuAdminButton': 'Admin',

    'checkpointsTab': 'Points de contrôle',

    'statusTab': 'Statut',

    'settingsTab': 'Paramètres',

    'welcomeMessage': `Bienvenue à ${appName}. Pour participer à l’effort de suivi de la propagation du virus SRAS-COV-2, veuillez scanner un point de contrôle chaque fois que vous interagissez avec d’autres d’une manière qui pourrait transmettre le virus.`,

    'hostCheckpointButton': 'Accueillir un point de contrôle',

    'joinCheckpointButton': 'Scanner un point de contrôle',

    'hostingCheckpointMessage': 'Vous êtes maintenant l’hôte d’un point de contrôle. D’autres peuvent se joindre à l’aide du code QR ci-dessous.',

    'endCheckpointButton': 'Point de contrôle final',

    'printCheckpointButton': 'Imprimer',

    'checkpointCreatedMessage': 'Point de contrôle créé',

    'noCameraPermissionMessage': "Cette application n’a pas la permission d’accéder à l’appareil photo de votre appareil. Au lieu de cela, vous pouvez prendre une photo du code QR.",

    'takePictureButton': 'Prendre une photo',

    'backButton': 'Précédent',

    'joinSuccessfulMessage': 'Vous avez rejoint le point de contrôle avec succès.',

    'scanErrorMessage': 'Le code QR n’a pas pu être lu. S’il vous plaît essayer à nouveau.',

    'statusLoadingMessage': 'Chargement de votre statut...',

    'statusNegativeMessage': 'Aucun chemin de transmission des personnes infectées vers vous n’a été découvert pour le moment. Cependant, tout le monde est à risque et les individus devraient suivre les directives de l’Autorité de santé publique, - gouvernement local.',

    'statusPositiveMessage': 'Un chemin de transmission possible d’un individu infecté vers vous a été découvert. Vous devriez prendre des mesures de précaution pour vous protéger et protéger les autres, selon les directives de l’autorité de santé publique et du gouvernement local.',

    'loadingMessage': 'Chargement...',

    'standardRiskLevelMessage': 'normal',

    'elevatedRiskLevelMessage': 'Élevé',

    'yourRiskLevelMessage': 'Votre niveau de risque',

    'aboutReportMessage': 'Si vous avez reçu un test positif, vous pouvez télécharger vos récents points de contrôle ci-dessous et partager ce fichier avec votre médecin. Cela avertira ceux qui ont pu être exposés de leur risque accru. Vous resterez anonyme',

    'reportButton': 'rapport anonyme',

    'downloadHistoryButton': 'Télécharger les points de contrôle',

    'aboutConfirmationCodeMessage': 'Avez-vous un code de confirmation à numériser? La numérisation d’un code de confirmation aidera ceux qui ont pu être exposés, en leur faisant savoir qu’il s’agit d’un risque légitime.',

    'scanConfirmationCodeButton': 'code de confirmation d’analyse',

    'scanWithoutConfirmationCodeButton': "Je n’ai pas de code.",

    'reportConfirmationMessage': 'Cela informera ceux qui ont pu être exposés de leur risque accru. Vous resterez anonyme. Cela ne peut pas être annulé.',

    'reportCompletedMessage': 'Votre état positif a été signalé anonymement. Les personnes à risque seront avisées. Merci.',

    'cancelReportButton': 'Ça ne fait rien',

    'confirmReportButton': 'Rapport maintenant',

    'aboutUseConfirmedDiagnoses': 'La sélection des « diagnostics confirmés » n’ignorera que les voies de transmission possibles à partir de rapports non confirmés.',

    'useConfirmedDiagnosesButton': 'N’utilisez que des diagnostics confirmés',

    'elevatedRiskAlertMessage': 'Votre niveau de risque est élevé.',

    'seeStatusTabMessage': 'Voir l’onglet statut.'

  }

}
