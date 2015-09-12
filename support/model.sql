CREATE TABLE IF NOT EXISTS `user`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `oauth` varchar(255) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `lobby`(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `status` enum('open','closed') NOT NULL,
    `owner_id` int(11) DEFAULT NULL,
    `mumble` varchar(255) DEFAULT NULL,
    `mumble_users` varchar(255) DEFAULT NULL,
    `draft_url` varchar(255) DEFAULT NULL,
    `game_status` enum('setup','started','ended') NOT NULL,
    `hots_logs_ref` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `lobby_players_user` (
    `players_id` int(11) DEFAULT NULL,
    `user_id` int(11) DEFAULT NULL,
    KEY `players_id` (`players_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `lobby_players_user_m2m_fk_1` FOREIGN KEY (`players_id`) REFERENCES `lobby` (`id`),
    CONSTRAINT `lobby_players_user_m2m_fk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `lobby` ADD CONSTRAINT `lobby_owner_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`);