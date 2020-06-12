const appName = process.env.REACT_APP_NAME

module.exports = {

  'translation': {

    'menuAboutButton': 'Sur',

    'menuCheckpointButton': 'Point de contrôle',

    'menuAdminButton': 'Admin',

    'checkpointsTab': 'Points de contrôle',

    'statusTab': 'Statut',

    'settingsTab': 'Paramètres',

    'welcomeMessage': `Bienvenue à ${appName}. Pour participer à l'effort de suivi de la propagation du virus SARS-COV-2, veuillez scanner un point de contrôle chaque fois que vous interagissez avec d'autres d'une manière qui pourrait transmettre le virus.`,

    'hostCheckpointButton': 'Héberger un point de contrôle',

    'joinCheckpointButton': 'Scanner un point de contrôle',

    'hostingCheckpointMessage': 'Vous hébergez maintenant un point de contrôle. D\'autres peuvent rejoindre en utilisant le code QR ci-dessous.',

    'endCheckpointButton': 'Fin du point de contrôle',

    'printCheckpointButton': 'Imprimer',

    'checkpointCreatedMessage': 'Point de contrôle créé',

    'noCameraPermissionMessage': "Cette application n'est pas autorisée à accéder à la caméra de votre appareil. Au lieu de cela, vous pouvez prendre une photo du code QR.",

    'takePictureButton': 'Prendre une photo',

    'backButton': 'Retour',

    'joinSuccessfulMessage': 'Vous avez rejoint le point de contrôle avec succès.',

    'scanErrorMessage': 'Le code QR n\'a pas pu être lu. Veuillez réessayer.',

    'statusLoadingMessage': 'Chargement de votre statut...',

    'statusNegativeMessage': 'Aucun lien de transmission d\'individus infectés vers vous n\'a été découvert à ce jour. Cependant, tout le monde est à risque et les individus doivent suivre les directives du Service de la Santé Publique et du gouvernement local.',

    'statusPositiveMessage': 'Un lien de transmission possible d\'un individu infecté à vous a été découvert. Vous devez prendre des mesures de précaution pour vous protéger et protéger les autres, conformément aux directives de l\'autorité de santé publique et du gouvernement local.',

    'loadingMessage': 'Chargement...',

    'standardRiskLevelMessage': 'normal',

    'elevatedRiskLevelMessage': 'Élevé',

    'yourRiskLevelMessage': 'Votre niveau de risque',

    'aboutReportMessage': 'Si vous avez reçu un test positif, vous pouvez télécharger vos points de contrôle récents ci-dessous et partager ce fichier avec votre médecin. Cela avertira ceux qui pourraient avoir été exposés de leur risque accru. Vous resterez anonyme.',

    'reportButton': 'rapport anonyme',

    'downloadHistoryButton': 'Télécharger les points de contrôle',

    'aboutConfirmationCodeMessage': 'Avez-vous un code de confirmation à scanner? La numérisation d\'un code de confirmation aidera ceux qui ont pu être exposés, en leur faisant savoir qu\'il s\'agit d\'un risque légitime.',

    'scanConfirmationCodeButton': 'Scanner le code de confirmation',

    'scanWithoutConfirmationCodeButton': 'Je n’ai pas de code.',

    'reportConfirmationMessage': 'Cela informera ceux qui ont pu être exposés de leur risque accru. Vous resterez anonyme. Ça ne peut pas être annulé.',

    'reportCompletedMessage': 'Votre statut positif a été signalé de manière anonyme. Les personnes à risque seront avisées. Je vous remercie.',

    'cancelReportButton': 'Pas de résultat',

    'confirmReportButton': 'Signaler maintenant',

    'aboutUseConfirmedDiagnoses': 'La sélection de« Utiliser uniquement les diagnostics confirmés »ignorera les chemins de transmission possibles à partir des rapports non confirmés.',

    'useConfirmedDiagnosesButton': 'N’utilisez que des diagnostics confirmés',

    'elevatedRiskAlertMessage': 'Votre niveau de risque est élevé.',

    'seeStatusTabMessage': 'Voir l’onglet statut.'

  }

}
