import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type Submission = {
    id : Nat;
    name : Text;
    whatsapp : Text;
    timestamp : Int;
  };

  type SubmissionWithScreenshot = {
    id : Nat;
    name : Text;
    whatsapp : Text;
    timestamp : Int;
    screenshotUrl : ?Text;
  };

  // Original stable map — kept as-is for upgrade compatibility
  let submissions = Map.empty<Nat, Submission>();
  // Separate stable map for screenshot URLs — added without breaking existing data
  let screenshotUrls = Map.empty<Nat, Text>();
  var nextId = 0;
  let adminPassword = "journexa-admin-2026";

  public shared ({ caller }) func submitTradeReview(name : Text, whatsapp : Text, screenshotUrl : ?Text) : async () {
    let submission : Submission = {
      id = nextId;
      name;
      whatsapp;
      timestamp = Time.now();
    };
    submissions.add(nextId, submission);
    switch (screenshotUrl) {
      case (?url) { screenshotUrls.add(nextId, url); };
      case null {};
    };
    nextId += 1;
  };

  public query ({ caller }) func getSubmissions(password : Text) : async [SubmissionWithScreenshot] {
    if (Text.equal(password, adminPassword)) {
      submissions.values().map(func(s : Submission) : SubmissionWithScreenshot {
        {
          id = s.id;
          name = s.name;
          whatsapp = s.whatsapp;
          timestamp = s.timestamp;
          screenshotUrl = screenshotUrls.get(s.id);
        };
      }).toArray();
    } else {
      [];
    };
  };
};
