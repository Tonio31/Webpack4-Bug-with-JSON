class AboutController {
  constructor($state) {
    "ngInject";
    var self = this;
    this.name = 'about';
    this.oneAtATime = true;

    this.groups = [
      {
        title: "Dynamic Group Header - 1",
        content: "Dynamic Group Body - 1"
      },
      {
        title: "Dynamic Group Header - 2",
        content: "Dynamic Group Body - 2"
      }
    ];

    this.items = ['Item 1', 'Item 2', 'Item 3'];

    this.addItem = function() {
      var newItemNo = self.items.length + 1;
      self.items.push('Item ' + newItemNo);
    };
  }






}

export default AboutController;
