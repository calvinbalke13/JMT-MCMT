function printInsnNode(printTgt) {
	print(printTgt+"|"+printTgt.opcode
			+"|"+printTgt.desc+"|"+printTgt.owner+"|"+printTgt.name+"|"+printTgt["var"])
}

function initializeCoreMod() {
    return {
        'SCPDriveDebug': {
            'target': {
            	'type': 'METHOD',
                'class': 'net.minecraft.world.server.ServerChunkProvider',
                "methodName": "func_212849_a_",
        		"methodDesc": "(IILnet/minecraft/world/chunk/ChunkStatus;Z)Lnet/minecraft/world/chunk/IChunk;"
            },
            'transformer': function(methodNode) {
            	print("[JMTSUPERTRANS] SCPDriveDebug Transformer Called");
            	var opcodes = Java.type('org.objectweb.asm.Opcodes');
            	var asmapi = Java.type('net.minecraftforge.coremod.api.ASMAPI');
            	var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
            	var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
            	var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
            	var MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
            	var JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
            	var LdcInsnNode = Java.type("org.objectweb.asm.tree.LdcInsnNode");
            	var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
            	var MethodType = asmapi.MethodType;

            	var targetMethodOwner = "net/minecraft/world/server/ServerChunkProvider$ChunkExecutor";
            	var targetMethodName = asmapi.mapMethod("func_213161_c"); 
            	var targetMethodDesc = "(Ljava/util/function/BooleanSupplier;)V";
            	
            	var method = methodNode
            	        		
        		var instructions = methodNode.instructions;
        		
        		var callTarget = asmapi.findFirstMethodCallAfter(method, MethodType.VIRTUAL, 
        				targetMethodOwner, targetMethodName, targetMethodDesc, 0);
        		
        		if (callTarget != null) {
        			print("[JMTSUPERTRANS] FOUND TARGET INSNS");
        		} else {
        			print("[JMTSUPERTRANS] MISSING TARGET INSNS:");
        			print("[JMTSUPERTRANS] HAVE CALL:" + (callTarget != null));
        			return;
        		}
        		
        		//Call Hook
        		var skipTarget = new LabelNode();
        		
        		var il = new InsnList();
        		il.add(new VarInsnNode(opcodes.ALOAD, 0));
        		il.add(new VarInsnNode(opcodes.ALOAD, 8));
        		il.add(new VarInsnNode(opcodes.LLOAD, 6));
        		il.add(new MethodInsnNode(opcodes.INVOKESTATIC, 
        				"org/jmt/mcmt/asmdest/DebugHookTerminator", "chunkLoadDrive",
        				"(Lnet/minecraft/world/server/ServerChunkProvider$ChunkExecutor;Ljava/util/function/BooleanSupplier;Lnet/minecraft/world/server/ServerChunkProvider;Ljava/util/concurrent/CompletableFuture;J)V"        				,false));
        		il.add(new JumpInsnNode(opcodes.GOTO, skipTarget));
        		
        		instructions.insertBefore(callTarget, il);
        		instructions.insert(callTarget, skipTarget);
          
                return methodNode;
            }
        },
        'InitialChunkCountBypass': {
            'target': {
            	'type': 'METHOD',
                'class': 'net.minecraft.server.MinecraftServer',
                "methodName": "func_213186_a",
        		"methodDesc": "(Lnet/minecraft/world/chunk/listener/IChunkStatusListener;)V"
            },
            'transformer': function(methodNode) {
            	print("[JMTSUPERTRANS] InitialChunkCountBypass Transformer Called");
            	var opcodes = Java.type('org.objectweb.asm.Opcodes');
            	var asmapi = Java.type('net.minecraftforge.coremod.api.ASMAPI');
            	var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
            	var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
            	var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
            	var MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
            	var JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
            	var LdcInsnNode = Java.type("org.objectweb.asm.tree.LdcInsnNode");
            	var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
            	var MethodType = asmapi.MethodType;

            	//mv.visitMethodInsn(INVOKEVIRTUAL, "net/minecraft/world/server/ServerChunkProvider", "getLoadedChunksCount", "()I", false);
            	var targetMethodOwner = "net/minecraft/world/server/ServerChunkProvider";
            	var targetMethodName = asmapi.mapMethod("func_217229_b"); 
            	var targetMethodDesc = "()I";
            	
            	var method = methodNode
            	        		
        		var instructions = methodNode.instructions;
        		
        		var callTarget = asmapi.findFirstMethodCallAfter(method, MethodType.VIRTUAL, 
        				targetMethodOwner, targetMethodName, targetMethodDesc, 0);
        		
        		if (callTarget != null) {
        			print("[JMTSUPERTRANS] FOUND TARGET INSNS");
        		} else {
        			print("[JMTSUPERTRANS] MISSING TARGET INSNS:");
        			print("[JMTSUPERTRANS] HAVE CALL:" + (callTarget != null));
        			return;
        		}
        		
        		var ultraTgt = callTarget.getNext().getNext();
        		var labelTgt = ultraTgt.label;
        		
        		
        		//Call Hook
        		
        		var il = new InsnList();
        		il.add(new MethodInsnNode(opcodes.INVOKESTATIC, 
        				"org/jmt/mcmt/asmdest/DebugHookTerminator", "isBypassLoadTarget",
        				"()Z"
        				,false));
        		il.add(new JumpInsnNode(opcodes.IFNE, labelTgt));
        		
        		instructions.insert(ultraTgt, il);
          
                return methodNode;
            }
        },
    }
}
